const router = require('express').Router()


router.get('/', (req, res) => {
    // List all active subscriptions for the current user
    const subscriptions = [
        {
            id: '5D1EA',
            name: 'First Subscription'
        },
        {
            id: '76CBB',
            name: 'Second Subscription'
        },
        {
            id: '99F48',
            name: 'Third Subscription'
        }
    ]
    res.send(subscriptions)
})

module.exports = router