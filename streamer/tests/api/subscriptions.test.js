/**
 *  Subscriptions Route Tests
 *
 * These tests are to prove the functionality of the api and to protect against
 * regression.
 *
 * These could be regarded as automated regression tests more than anything else.
 */
let request = require('supertest');
let app = require('../../src/app')


const setupTestDB = () => {
    // in memrory db is used right now, this will be used with an exposed mongodb
    // tests should be updated to use these methods to setup and initial users
    // and subscriptions
}

const teardownTestDB = () => {
// in memrory db is used right now, this will be used with an exposed mongodb
    // tests should be updated to use these methods to setup and initial users
    // and subscriptions
}

const getSubscription = (body) => {
    return request(app)
        .get('/subscriptions')
        .send(body)
        .set('Accept', 'application/json')
}

const postSubscription = (body) => {
    return request(app)
        .post('/subscriptions')
        .send(body)
}

const deleteSubscription = (body) => {
    return request(app)
        .delete('/subscriptions')
        .send(body)
}


describe('Subscription API Routes', () => {
    describe ('GET /subscriptions', () => {
        beforeEach(() => {
            setupTestDB()
        })

        afterEach(() => {
            teardownTestDB()
        })

        test('Failing to provide User ID in body should return BAD REQUEST', async () => {
            const res = await getSubscription()
            expect(res.statusCode).toBe(400);
        })

        test('Providing a user ID not in the db should return NOT FOUND', async () => {
            const res = await getSubscription({userId: '0000'})
            expect(res.statusCode).toBe(404)
        })
    })

    describe ('POST /subscriptions', () => {
        test('Missing userId or subscriptionId results in BAD REQUEST', async () => {
            const bothMissingRes = await postSubscription()
            const userIdMissingRes = await postSubscription({subscriptionId: '1234'})
            const subscriptionIdMissingRes = await postSubscription({userId: '1234'})

            expect(bothMissingRes.statusCode).toBe(400)
            expect(userIdMissingRes.statusCode).toBe(400)
            expect(subscriptionIdMissingRes.statusCode).toBe(400)
        })
        test('Adding a subscription to a user that doesn\'t exist should mean the user is created with the subscription', async () => {
            const creationRes = await postSubscription({userId: '1234', subscriptionId: 'abcd', meta: {name: 'Test subscription'}})
            expect(creationRes.statusCode).toBe(200)

            const retrievalres = await getSubscription({userId: '1234'})

            expect(retrievalres.statusCode).toBe(200)
            expect(retrievalres.body['abcd'].meta).toEqual({name: 'Test subscription'})
        })

        test('Adding a subscription to existing user should succeed', async () => {
            const firstCreateRes = await postSubscription({
                userId: 'testuser',
                subscriptionId: 'first',
                meta: {name: 'First Test subscription'}
            })
            expect(firstCreateRes.statusCode).toBe(200)

            const secondCreateRes = await postSubscription({
                userId: 'testuser',
                subscriptionId: 'second',
                meta: {name: 'Second Test subscription'}
            })
            expect(secondCreateRes.statusCode).toBe(200)

            const retrievalres = await getSubscription({userId: 'testuser'})

            const subscriptionIds = Object.keys(retrievalres.body)
            expect(subscriptionIds).toEqual(['first', 'second'])
        })

        test('Adding a subscription to a user that already has that subscription should return COLLISION', async () => {
            const firstCreateRes = await postSubscription({
                userId: 'collisionUser',
                subscriptionId: 'first',
                meta: {name: 'First Test subscription'}
            })
            expect(firstCreateRes.statusCode).toBe(200)

            const secondCreateRes = await postSubscription({
                userId: 'collisionUser',
                subscriptionId: 'first',
                meta: {name: 'first Test subscription'}
            })
            expect(secondCreateRes.statusCode).toBe(409)
        })

        test('Adding more than three subscriptions is rejected', async () => {
            const subscriptionReses = await Promise.all([
                {userId: 'tooManyUser', subscriptionId: '1'},
                {userId: 'tooManyUser', subscriptionId: '2'},
                {userId: 'tooManyUser', subscriptionId: '3'},
                {userId: 'tooManyUser', subscriptionId: '4'},
            ].map(async (userSub) => (await postSubscription(userSub)).statusCode))
            expect(subscriptionReses).toEqual([200, 200, 200, 403])
        })
    })

    describe ('DELETE /subscriptions', () => {
        test('Missing userId or subscriptionId results in BAD REQUEST', async () => {
            const bothMissingRes = await deleteSubscription()
            const userIdMissingRes = await deleteSubscription({subscriptionId: '1234'})
            const subscriptionIdMissingRes = await deleteSubscription({userId: '1234'})

            expect(bothMissingRes.statusCode).toBe(400)
            expect(userIdMissingRes.statusCode).toBe(400)
            expect(subscriptionIdMissingRes.statusCode).toBe(400)
        })

        test('Deleting with a non-existing user should return NOT FOUND', async () => {
            const res = await deleteSubscription({userId: 'User Not Found', subscriptionId: 'subscription not found'})
            expect(res.statusCode).toBe(404)
        })

        test('Deleting with a non-existing subscriptionId should return NOT FOUND', async () => {
            const addRes = await postSubscription({
                userId: 'subscription not found',
                subscriptionId: 'first',
                meta: {name: 'first Test subscription'}
            })
            expect(addRes.statusCode).toBe(200)

            const res = await deleteSubscription({userId: 'subscription not found', subscriptionId: 'subscription not found'})
            expect(res.statusCode).toBe(404)
        })

        test('Deleting a subscription removes it successfully', async () => {
            const firstAddRes = await postSubscription({userId: 'deletingUser', subscriptionId: 'first', meta: {name: 'first Test subscription'}})
            expect(firstAddRes.statusCode).toBe(200)

            const secondAddRes = await postSubscription({userId: 'deletingUser', subscriptionId: 'second', meta: {name: 'first Test subscription'}})
            expect(secondAddRes.statusCode).toBe(200)

            const firstFetchRes = await getSubscription({userId: 'deletingUser'})
            expect(Object.keys(firstFetchRes.body)).toEqual(['first', 'second'])

            const res = await deleteSubscription({userId: 'deletingUser', subscriptionId: 'first'})
            expect(res.statusCode).toBe(200)

            const secondFetchRes = await getSubscription({userId: 'deletingUser'})
            expect(Object.keys(secondFetchRes.body)).toEqual(['second'])
        })
    })
})
