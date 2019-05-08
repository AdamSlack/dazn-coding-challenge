const MemoryDB = require('../providers/memorydb')

let db


const testUserId = 'USERID001'
const testSubscriptionId = 'SUBID001'

const testSubscription = {
    subscriptionId: testSubscriptionId,
    meta: {
        name: 'Test subscription data'
    },
    registedOn: '2019-05-05T13:57:14.235Z'
}


const testUserSubscriptions = {
    userId: testUserId,
    subscriptions: [testSubscription]
}



describe('MemoryDB implementation Class', () => {
    beforeEach(() => {
        db = new MemoryDB()
    })

    describe('constructor', () => {
        it('Should create an empty object of user subscriptions', () => {
            const expected = []
            const actual = db.userSubscriptions
            expect(actual).toEqual(expected)
        })
    })

    describe('getUsersSubscriptions', () => {
        it('Should resolve to empty object if userId is not in object of user subscriptions', async () => {
            const fakeUserId = '0000'
            const actual = await db.getUsersSubscriptions(fakeUserId)
            expect(actual).toBeFalsy()
        })

        it ('Should resolve to be an object of subscriptions if user has subscriptions', async () => {
            db.userSubscriptions = [testUserSubscriptions]
            const actual = await db.getUsersSubscriptions(testUserId)
            expect(actual).toEqual(testUserSubscriptions)
        })
    })
})