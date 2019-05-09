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
    {subscriptionId: '0001'}
  ]
}

const userWithTwoSubscriptions = {
  userId: '0002',
  subscriptions: [
    {subscriptionId: '0001'},
    {subscriptionId: '0002'}
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
        console.log(res)
        expect(res).toEqual(userWithNoSubscriptions)
      })
    })
})