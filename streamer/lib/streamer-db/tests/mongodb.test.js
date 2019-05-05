const DB = require('./db')

class MongoDB extends DB {
    constructor () {
        super()
    }

    async getUsersSubscriptions () {}
    async removeUser () {}
    async addUser () {}
    async addSubscriptionToUser () {}
    async removeSubscriptionFromUser () {}
}

module.exports = MongoDB