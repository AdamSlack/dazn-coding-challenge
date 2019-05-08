const DB = require('./db')

class MongoDB extends DB {
  constructor() {
    super()

    this.mongoose = require('mongoose')

    this.mongoose.connect(`mongodb://mongodb/subscriptions`, { useNewUrlParser: true })
      .then(() => console.info('MongoDB Active and Connected'))
      .catch(err => console.error(err));

    this.Schema = this.generateSchema()
    this.Model = this.generateModel()
  }

  generateSchema () {
    return new this.mongoose.Schema({
      userId: String,
      subscriptions: [{
        subscriptionId: String,
        subscription: {
          registedOn: { type: Date, default: (new Date()).toISOString() },
          meta: { type: Object, default: {} }
        }
      }]
    })
  }

  generateModel () {
    return this.mongoose.model('subscriptions', this.Schema)
  }

  async getUsersSubscriptions(userId) {
    const mongoUserSubscription = await this.Model.findOne({userId: userId})
    const userSubscription = { [userId]: {} }
    mongoUserSubscription.subscriptions.forEach((sub) => {
      userSubscription[userId][sub.subscriptionId] = sub.subscription
    })
    return userSubscription
  }

  async removeUser(userId) {

  }

  async addUser(userId, subscriptions) {
    const userSubscription = new this.Model({
      userId: userId,
      subscriptions: Object.keys(subscriptions).map((subId) => ({
        subscriptionId: subId,
        subscription: subscriptions[subId]
      }))
    })

    return userSubscription.save()
  }

  addSubscriptionToUser(userId, subscription) {

    const mongoSubId = Object.keys(subscription)[0]

    this.Model.findOneAndUpdate(
      { userId: userId },
      { $push: { subscriptions: { subscriptionId: mongoSubId, subscription: subscription[mongoSubId]}}}
    )
  }

  async removeSubscriptionFromUser(userId, subscriptionId) {

  }
}

module.exports = MongoDB