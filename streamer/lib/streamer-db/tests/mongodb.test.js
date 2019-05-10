const MongoDB = require('../providers/mongodb')
const MockModel = require('./__mocks__/MockModel')
const MockSchema = require('./__mocks__/MockSchema')

jest.mock('./__mocks__/MockSchema')
jest.mock('./__mocks__/MockModel')
const mockGenerateSchema = jest.fn(() => new MockSchema())
const mockGenerateModel = jest.fn(() => new MockModel())

const userIdParam = 'testUserId'
const subscriptionIdParam = 'testSubId'
const testSubscription = { subscriptionId: subscriptionIdParam }
const testUserSubscription = { userId: userIdParam, subscriptions: [testSubscription] }

const mockMongoose = {
  connect: jest.fn(() => Promise.resolve()),
  model: jest.fn(() => new MockModel()),
  Schema: MockSchema
}


describe('MemoryDB implementation Class', () => {
  let db
  beforeEach(() => {
    MockModel.mockClear()
    db = new MongoDB(mockMongoose)
  })

  describe('constructor', () => {
    beforeEach(() => {
      MongoDB.prototype.generateSchema = mockGenerateSchema
      MongoDB.prototype.generateModel = mockGenerateModel
      db = new MongoDB(mockMongoose)
    })

    it('Should attempt to connect to mongodb instance', () => {
      expect(mockMongoose.connect).toBeCalledWith(`mongodb://mongodb/subscriptions`, { useFindAndModify: false, useNewUrlParser: true })
    })

    it('Should generate a Schema', () => {
      expect(mockGenerateSchema).toBeCalled()
    })

    it('Should generate a model', () => {
      expect(mockGenerateModel).toBeCalled()
    })

    it('Should have a schema after construction', () => {
      expect(db.Schema).toBeInstanceOf(MockSchema)
    })

    it('Should have a model after construction', () => {
      expect(db.Model).toBeInstanceOf(MockModel)
    })
  })

  describe('generateSchema', () => {
    let res
    beforeEach(() => {
      res = db.generateSchema()
    })

    it('Schema Constructor should be called', () => {
      expect(MockSchema).toBeCalled()
    })

    it('Should return an instantiated Schema Object', () => {
      expect(res).toBeInstanceOf(db.mongoose.Schema)
    })
  })

  describe('generateModel', () => {
    let res
    beforeEach(() => {
      res = db.generateModel()
    })

    it('Schema Constructor should be called', () => {
      expect(db.mongoose.model).toBeCalled()
    })

    it('Should return an instantiated Model Object', () => {
      expect(res).toBeInstanceOf(MockModel)
    })
  })

  describe('getUsersSubscriptions', () => {
    let res
    beforeEach(() => {
      db.Model.findOne = jest.fn().mockImplementation(() => testUserSubscription)
      res = db.getUsersSubscriptions(userIdParam)
    })

    it('Should call the model\'s findOne method with userId param', () => {
      expect(db.Model.findOne).toBeCalledWith({userId: userIdParam})
    })

    it('Should return promise resolving to be results from DB method call', async () => {
      await expect(res).resolves.toEqual(testUserSubscription)
    })
  })

  describe('removeUser', () => {
    let res
    beforeEach(() => {
      res = db.removeUser(userIdParam)
    })

    it('Should call the model\'s findOneAndRemove method with userId param', () => {
      expect(db.Model.findOneAndRemove).toBeCalledWith({userId: userIdParam})
    })
  })

  describe('addUser', () => {
    let res
    beforeEach(() => {
      res = db.addUser(userIdParam, [])
    })

    it('Should use the model to create a userSubscription document', () => {
      expect(db.Model.create).toBeCalledWith({ userId: userIdParam, subscriptions: [] })
    })
  })

  describe('addSubscriptionToUser', () => {
    let res
    beforeEach(() => {
      res = db.addSubscriptionToUser(userIdParam, testSubscription)
    })

    it('Should use the model to find and update the subscriptions for the specified userId', () => {
      expect(db.Model.findOneAndUpdate).toBeCalledWith(
        { userId: userIdParam },
        { $push: { subscriptions: testSubscription} }
      )
    })

  })

  describe('removeSubscriptionFromUser', () => {
    let res
    beforeEach(() => {
      res = db.removeSubscriptionFromUser(userIdParam, subscriptionIdParam)
    })

    it('Should the model to find and pull the specified userId\'s specified subscription', () => {
      expect(db.Model.findOneAndUpdate).toBeCalledWith(
        { userId: userIdParam },
        { $pull: { subscriptions: { subscriptionId: subscriptionIdParam } }}
      )
    })

  })

})