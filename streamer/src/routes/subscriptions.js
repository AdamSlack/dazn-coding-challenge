const router = require('express').Router()
const { db } = require('streamer-db')

router.route('/')
    .get(getSubscriptions)
    .post(addSubscription)
    .delete(deleteSubscription)

async function getSubscriptions (req, res) {
    // List all active subscriptions for the specified user
    const { userId } = req.body

    if (!userId) {
        return res.sendStatus(400)
    }

    try {
        const userSubscriptions = await db.getUsersSubscriptions(userId)
        if (!userSubscriptions) {
            res.send(404)
        } else {
            res.send(userSubscriptions)
        }
    } catch (err) {
        console.error(err)
        res.send(500)
    }
}

async function addSubscription (req, res) {
    // add a subscription for the specified user
    const { userId, subscriptionId, meta } = req.body
    if (!userId || !subscriptionId) {
        return res.sendStatus(400)
    }

    const newSubscription = { [subscriptionId]: { meta, registedOn: (new Date()).toISOString()}}
    let userSubscriptions
    try {
        userSubscriptions = await db.getUsersSubscriptions(userId)
    } catch(err) {
        res.send(500)
    }

    if (!userSubscriptions) {
        try {
            await db.addUser(userId, newSubscription)
            res.sendStatus(200)
        } catch (err) {
            console.error(err)
            res.sendStatus(500)
        }
    } else if (userSubscriptions[subscriptionId]) {
        return res.sendStatus(409)
    } else {
        try {
            await db.addSubscriptionToUser(userId, newSubscription)
            res.sendStatus(200)
        } catch (err) {
            console.error(err)
            res.sendStatus(500)
        }
    }
}

async function deleteSubscription (req, res) {
    // remove an active subscription for the specified user
    const { userId, subscriptionId } = req.body

    if (!userId || !subscriptionId) {
        return res.sendStatus(400)
    }

    if (!userSubscriptions) {
        return res.sendStatus(404)
    }

    if (!userSubscriptions[subscriptionId]) {
        return res.sendStatus(404)
    }

    try {
        await db.removeSubscriptionFromUser(userId, subscriptionId)
        res.sendStatus(200)
    } catch (err) {
        console.error(err)
        res.send(500)
    }
}


module.exports = router