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
        registedOn: { type: Date, default: (new Date()).toISOString() },
        meta: { type: Object, default: {} }
      }]
    })
  }

  generateModel () {
    return this.mongoose.model('subscriptions', this.Schema)
  }

  async getUsersSubscriptions(userId) {
    return await this.Model.findOne({userId: userId})
  }

  async removeUser(userId) {
    await this.Model.findOneAndRemove({userId: userId})
  }

  async addUser(userId, subscriptions = []) {
    const userSubscription = new this.Model({
      userId: userId,
      subscriptions: subscriptions
    })

    return userSubscription.save()
  }

  addSubscriptionToUser(userId, subscription) {
    this.Model.findOneAndUpdate(
      { userId: userId },
      { $push: { subscriptions: subscription} }
    )
  }

  async removeSubscriptionFromUser(userId, subscriptionId) {
    this.Model.findOneAndUpdate(
      { userId: userId },
      { $pull: { 'subscription.subscriptionId': subscriptionId }}
    )
  }
}

module.exports = MongoDB