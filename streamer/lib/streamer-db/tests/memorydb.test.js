const MemoryDB = require('../providers/memorydb')

let db


const testUserId = 'USERID001'
const testSubscriptionId = 'SUBID001'

const testSubscription = {
    [testSubscriptionId]: {
        meta: {
            name: 'Test subscription data'
        },
        registedOn: '2019-05-05T13:57:14.235Z'
    }
}

const testUserSubscriptions = {
    [testUserId]: {
        ...testSubscription
    }
}

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
        it('Should resolve to empty object if userId is not in object of user subscriptions', () => {
            const fakeUserId = '0000'
            const actual = db.getUsersSubscriptions(fakeUserId)
            expect(actual).resolves.toBeFalsy()
        })

        it ('Should resolve to be an object of subscriptions if user has subscriptions', () => {
            db.userSubscriptions = testUserSubscriptions
            const actual = db.getUsersSubscriptions(testUserId)
            expect(actual).resolves.toEqual(testSubscription)
        })
    })
})