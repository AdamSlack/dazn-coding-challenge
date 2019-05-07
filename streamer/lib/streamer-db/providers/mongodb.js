const DB = require('./db')

class MongoDB extends DB {
  constructor() {
    super()

    this.mongoose = require('mongoose')

    this.mongoose.connect(`mongodb://mongodb/subscriptions`, { useNewUrlParser: true })
      .then(() => console.info('MongoDB Active and Connected'))
      .catch(err => console.error(err));

    this.schema = this.generateSchema()
    this.model = this.generateModel()
  }

  generateSchema () {
    return new this.mongoose.Schema({
      userId: {
        subscriptionId: {
          registedOn: { type: Date, default: (new Date()).toISOString() },
          meta: { type: Object, default: {} }
        }
      }
    })
  }

  generateModel () {
    return this.mongoose.model('subscriptions', this.schema)
  }

  async getUsersSubscriptions(userId) {
  }

  async removeUser(userId) {

  }

  async addUser(userId, subscriptions) {

  }

  async addSubscriptionToUser(userId, subscription) {

  }

  async removeSubscriptionFromUser(userId, subscriptionId) {

  }
}

module.exports = MongoDB