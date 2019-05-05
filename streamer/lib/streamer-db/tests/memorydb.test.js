const MemoryDB = require('../providers/memorydb')

let db
describe('MemoryDB implementation Class', () => {
    beforeEach(() => {
        db = new MemoryDB()
    })

    describe('constructor', () => {
        it('Should create an empty object of user subscriptions', () => {
            const expected = {}
            const actual = db.userSubscriptions
            expect(actual).toEqual(expected)
        })
    })

    describe('getUsersSubscriptions', () => {
        it('Should resolve to empty object if userId is not in object of user subsciptions', () => {
            const fakeUserId = '0000'
            const actual = db.getUsersSubscriptions(fakeUserId)
            expect(actual).resolves.toBeFalsy()
        })
    })
})