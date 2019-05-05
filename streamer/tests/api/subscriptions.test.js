const request = require('supertest');
const app = require('../../src/app')

describe('Subscription API Routes', () => {
    describe ('GET /subscriptions', () => {
        test('Failing to provide User ID in body should return BAD REQUEST', async () => {
            const res = await request(app).get('/subscriptions')
            expect(res.statusCode).toBe(400);
        })

        test('Providing a user ID not in the db should return NOT FOUND', async () => {
            const res = await request(app)
                .get('/subscriptions')
                .send({userId: '0000'})
            expect(res.statusCode).toBe(404)
        })
    })

})
