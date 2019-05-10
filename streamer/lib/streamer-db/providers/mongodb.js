const DB = require('./db')

class MongoDB extends DB {
  constructor(mongoose) {
    super()

    this.mongoose = mongoose || require('mongoose')

    this.mongoose.connect(`mongodb://mongodb/subscriptions`, {
      useNewUrlParser: true,
      useFindAndModify: false
    }).then(() => console.info('MongoDB Active and Connected'))
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
    },
    { collection: 'subscriptions' })
  }

  generateModel () {
    return this.mongoose.model('subscriptions', this.Schema, 'subscriptions')
  }

  async getUsersSubscriptions(userId) {
    return await this.Model.findOne({userId: userId})
  }

  async removeUser(userId) {
    await this.Model.findOneAndRemove({userId: userId})
  }

  async addUser(userId, subscriptions = []) {
    await this.Model.create({
      userId: userId,
      subscriptions: subscriptions
    })
  }

  async addSubscriptionToUser(userId, subscription) {
    await console.log(subscription)
    await console.log(await this.Model.findOne({userId: userId}))
    await this.Model.findOneAndUpdate(
      { userId: userId },
      { $push: { subscriptions: subscription } }
    )
  }

  async removeSubscriptionFromUser(userId, subscriptionId) {
    await this.Model.findOneAndUpdate(
      { userId: userId },
      { $pull: { 'subscription.subscriptionId': subscriptionId }}
    )
  }
}

module.exports = MongoDB