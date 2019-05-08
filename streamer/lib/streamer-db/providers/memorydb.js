const DB = require('./db')

class MemoryDB extends DB {
    constructor () {
        super()
        this.userSubscriptions = []
        console.info('MemoryDB Active')
    }

    async getUsersSubscriptions (userId) {
        return this.userSubscriptions.find((user) => user.userId  == userId)
    }

    async removeUser (userId) {
        delete this.userSubscriptions.find((user) => user.userId  == userId)
    }

    async addUser (userId, subscriptions = []) {
        let userSubscriptions = await this.getUsersSubscriptions(userId)
        if (!userSubscriptions) {
            this.userSubscriptions.push({ userId, subscriptions: subscriptions })
        }
        return await this.getUsersSubscriptions(userId)
    }

    async addSubscriptionToUser (userId, subscription) {
        let userSubscriptions = await this.getUsersSubscriptions(userId)
        if(!userSubscriptions) {
            userSubscriptions = await this.addUser(userId, [subscription])
        } else {
            userSubscriptions.subscriptions.push(subscription)
        }
        return userSubscriptions
    }

    async removeSubscriptionFromUser (userId, subscriptionId) {
        const userSubscriptions = await this.getUsersSubscriptions(userId)
        userSubscriptions.subscriptions = userSubscriptions.subscriptions.filter((sub) => sub.subscriptionId !== subscriptionId)
        return userSubscriptions
    }
}

module.exports = MemoryDB