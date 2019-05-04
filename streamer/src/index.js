const express = require('express')
const parser = require('body-parser')

const { PORT = 5100 } = process.env

const app = express()

// middleware
app.use(parser.json());

// routes
app.use('/subscriptions', require('./routes/subscriptions'))

// start server
console.info('Listening on port', PORT)
const server = app.listen(PORT)
