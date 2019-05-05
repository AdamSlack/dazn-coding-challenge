
class DB {
    constructor () {}

    async getUsersSubscriptions (userId) {
        throw new Error('Abstract method getUsersSubscriptions requires an implementation')
    }

    async removeUser (userId) {
        throw new Error('Abstract method removeUser requires an implementation')
    }

    async addUser (userId, subscriptions) {
        throw new Error('Abstract method addUser requires an implementation')
    }

    async addSubscriptionToUser (userId, subscription) {
        throw new Error('Abstract method addSubscriptionToUser requires an implementation')
    }

    async removeSubscriptionFromUser (userId, subscription) {
        throw new Error('Abstract method removeSubscriptionFromUser requires an implementation')
    }
}

module.exports = DB