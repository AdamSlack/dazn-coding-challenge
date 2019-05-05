const DB = require('../providers/db')
let db

describe ('DB Interface class', () => {
  beforeEach(() => {
    db = new DB()
  })

  describe('getUsersSubscriptions', () => {
    it('should thrown an error if invoked', () => {
      expect(db.getUsersSubscriptions).rejects
    })
  })

  describe('removeUser', () => {
    it('should thrown an error if invoked', () => {
      expect(db.removeUser).rejects

    })
  })

  describe('addUser', () => {
    it('should thrown an error if invoked', () => {
      expect(db.addUser).rejects

    })
  })

  describe('addSubscriptionToUser', () => {
    it('should thrown an error if invoked', () => {
      expect(db.addSubscriptionToUser).rejects
    })
  })

  describe('removeSubscriptionFromUser', () => {
    it('should thrown an error if invoked', () => {
      expect(db.removeSubscriptionFromUser).rejects
    })
  })
})