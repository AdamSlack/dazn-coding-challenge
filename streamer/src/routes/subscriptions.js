const router = require('express').Router()

router.route('/')
    .get(getSubscriptions)
    .post(addSubscription)
    .delete(deleteSubscription)

const temp_in_memory_subscriptions = {
    '389FA': {
        '5D1EA': {
            meta: {
                name: 'First Subscription',
            },
            registedOn: '2019-05-04T12:40:19.095Z'
        },
        '76CBB': {
            meta: {
                name: 'Second Subscription',
            },
            registedOn: '2019-05-04T13:10:19.095Z'
        },
        '99F48': {
            meta: {
                name: 'Third Subscription'
            },
            registedOn: '2019-05-04T13:40:19.095Z'
        }
    }
}

function getSubscriptions (req, res) {
    // List all active subscriptions for the specified user
    const { userId } = req.body

    if (!userId) {
        return res.sendStatus(400)
    }

    const userSubscriptions = temp_in_memory_subscriptions[userId] || {}
    res.send(userSubscriptions)
}

function addSubscription (req, res) {
    // add a subscription for the specified user
    const { userId, subscriptionId, meta } = req.body
    if (!userId || !subscriptionId) {
        return res.sendStatus(400)
    }

    if (!temp_in_memory_subscriptions[userId]) {
        return res.sendStatus(404)
    }

    if (temp_in_memory_subscriptions[userId][subscriptionId]) {
        return res.sendStatus(409)
    }

    temp_in_memory_subscriptions[userId][subscriptionId] = { meta, registedOn: (new Date()).toISOString()}
    res.sendStatus(200)
}

function deleteSubscription (req, res) {
    // remove an active subscription for the specified user
    const { userId, subscriptionId } = req.body

    if (!userId || !subscriptionId) {
        return res.sendStatus(400)
    }

    if (!temp_in_memory_subscriptions[userId]) {
        return res.sendStatus(404)
    }

    if (!temp_in_memory_subscriptions[userId][subscriptionId]) {
        return res.sendStatus(404)
    }

    delete temp_in_memory_subscriptions[userId][subscriptionId]
    res.sendStatus(200)
}


module.exports = router