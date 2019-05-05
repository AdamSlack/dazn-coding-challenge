const express = require('express')
const parser = require('body-parser')
const app = express()

// middleware
app.use(parser.json());

// routes
app.use('/subscriptions', require('./routes/subscriptions'))

module.exports = app