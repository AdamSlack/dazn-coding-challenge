const express = require('express')
const { PORT = 5100 } = process.env

const app = express()

app.use('/subscriptions', require('./routes/subscriptions'))

console.info('Listening on port', PORT)
const server = app.listen(PORT)
 