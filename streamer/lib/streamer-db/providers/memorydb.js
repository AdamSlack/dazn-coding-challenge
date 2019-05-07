const DB = require('./db')

class MemoryDB extends DB {
    constructor () {
        super()
        this.userSubscriptions = {}
        console.info('MemoryDB Active')
    }

    async getUsersSubscriptions (userId) {
        return this.userSubscriptions[userId]
    }

    async removeUser (userId) {
        delete this.userSubscriptions[userId]
    }

    async addUser (userId, subscriptions = {}) {
        this.userSubscriptions[userId] = subscriptions
        return this.userSubscriptions[userId]
    }

    async addSubscriptionToUser (userId, subscription) {
        this.userSubscriptions[userId] = {
            ...this.userSubscriptions[userId],
            ...subscription
        }
        return this.userSubscriptions[userId]
    }

    async removeSubscriptionFromUser (userId, subscriptionId) {
        delete this.userSubscriptions[userId][subscriptionId]
        return this.userSubscriptions[userId]
    }
}

module.exports = MemoryDB