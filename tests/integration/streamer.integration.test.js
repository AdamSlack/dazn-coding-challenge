const request = require('request-promise')
const { MongoClient } = require('mongodb');

const uri = 'http://localhost:5100/subscriptions'

const userWithNoSubscriptions = {
  userId: '0000',
  subscriptions: []
}

const userWithOneSubscriptions = {
  userId: '0001',
  subscriptions: [
    {subscriptionId: '0000'}
  ]
}

const userWithTwoSubscriptions = {
  userId: '0002',
  subscriptions: [
    {subscriptionId: '0000'},
    {subscriptionId: '0001'}
  ]
}

describe('Streamer subscription API integration with MongoDB', () => {
  let connection;
  let db;
  let userSubscriptions

  beforeAll(async () => {
    connection = await MongoClient.connect('mongodb://localhost', { useNewUrlParser: true });
    db = await connection.db('subscriptions');
    userSubscriptions = await db.collection('subscriptions')
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  beforeEach(async () => {
    await userSubscriptions.insertOne(userWithNoSubscriptions)
    await userSubscriptions.insertOne(userWithOneSubscriptions)
    await userSubscriptions.insertOne(userWithTwoSubscriptions)
  })

  afterEach(async () => {
    await userSubscriptions.deleteMany({})
  })

    describe('GET - /subscriptions', () => {
      const req = {
        method: 'GET',
        uri,
        body: {
          userId: 'NOT REAL'
        },
        headers: {
          'content-type': 'application/json',
        },
        json: true
      }

      it('should return 404 for users that do not exist', () => {
        expect(request(req)).rejects.toThrow('404 - "Not Found"')
      })

      it('should return userSubscriptions for user with no subscriptions', async () => {
        req.body.userId = '0000'
        const res = await request(req)
        expect(res.userId).toEqual('0000')
        expect(res.subscriptions).toEqual([])
      })

      it('should return userSubscriptions for user with subscriptions', async () => {
        req.body.userId = '0002'
        const res = await request(req)
        expect(res.userId).toEqual('0002')
        res.subscriptions.forEach((sub, idx) => {
          expect(sub.subscriptionId).toEqual(`000${idx}`)
        })
      })
    })

  describe('POST - /subscriptions', () => {
    const req = {
      method: 'POST',
      uri,
      body: {
        userId: 'NOT REAL',
        subscriptionId: 'NOT REAL'
      },
      headers: {
        'content-type': 'application/json',
      },
      json: true
    }

    it('Should create a userSubscription if user never existed', async () => {
      await request(req)
      const res = await userSubscriptions.findOne({userId: 'NOT REAL'})
      const expectedObject = {userId: 'NOT REAL', subscriptions: [{subscriptionId: 'NOT REAL'}]}
      expect(res).toMatchObject(expectedObject)
    })

    it('Should add a subscriptiont to an existing userSubscription', async () => {
      req.body.userId = '0001'
      await request(req)
      const res = await userSubscriptions.findOne({userId: '0001'})
      const expectedObject = {userId: '0001', subscriptions: [{ subscriptionId: '0000' }, { subscriptionId: 'NOT REAL' }]}
      expect(res).toMatchObject(expectedObject)
    })

    it('Should indicated a conflict if a subscription is already registered for a user', async () => {
      const res = await userSubscriptions.findOne({userId: '0001'})
      expect(res).toMatchObject({userId: '0001', subscriptions: [{ subscriptionId: '0000' }]})
      req.body.userId = '0001'
      req.body.subscriptionId = '0000'
      await expect(request(req)).rejects.toThrow('409 - "Conflict"')
    })

    it('Should forbid a request that involves adding adding a 4th or more subscription', async () => {
      const res = await userSubscriptions.findOne({userId: '0002'})
      expect(res).toMatchObject({userId: '0002', subscriptions: [{ subscriptionId: '0000' }, { subscriptionId: '0001' }]})
      req.body.userId = '0002'
      req.body.subscriptionId = '0003'
      await expect(request(req)).resolves.toBe('OK')

      req.body.subscriptionId = '0004'
      await expect(request(req)).rejects.toThrow('403 - "Forbidden"')
    })

    it('should give a 400 response if userId or subscriptionId is missing', async () => {
      req.body.userId = ''
      await expect(request(req)).rejects.toThrow('400 - "Bad Request"')
      req.body.subscriptionId = ''
      await expect(request(req)).rejects.toThrow('400 - "Bad Request"')
      req.body.userId = 'NOT REAL'
      await expect(request(req)).rejects.toThrow('400 - "Bad Request"')
    })
  })

  describe('DELETE - /subscriptions', () => {
    const req = {
      method: 'DELETE',
      uri,
      body: {
        userId: 'NOT REAL',
        subscriptionId: 'NOT REAL'
      },
      headers: {
        'content-type': 'application/json',
      },
      json: true
    }

    it('Should give give a 404 response if user is not found', () => {
      expect(request(req)).rejects.toThrow('404 - "Not Found"')
    })

    it('Should give give a 404 response if subscription is not found', () => {
      req.body.id = '0001'
      expect(request(req)).rejects.toThrow('404 - "Not Found"')
    })

    it('should give a 400 response if userId or subscriptionId is missing', async () => {
      req.body.userId = ''
      await expect(request(req)).rejects.toThrow('400 - "Bad Request"')
      req.body.subscriptionId = ''
      await expect(request(req)).rejects.toThrow('400 - "Bad Request"')
      req.body.userId = 'NOT REAL'
      await expect(request(req)).rejects.toThrow('400 - "Bad Request"')
    })

    it('Should remove a subscription if it exists', async () => {
      const beforeRes = await userSubscriptions.findOne({userId: '0002'})
      expect(beforeRes).toMatchObject({userId: '0002', subscriptions: [{ subscriptionId: '0000' }, { subscriptionId: '0001' }]})      

      req.body.userId = '0002'
      req.body.subscriptionId = '0000'
      await request(req)

      const afterRes = await userSubscriptions.findOne({userId: '0002'})
      await expect(afterRes).toMatchObject({userId: '0002', subscriptions: [{subscriptionId: '0001'}]})
    })
  })
})