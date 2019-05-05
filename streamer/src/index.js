const app = require('./app')
const { PORT = 5100 } = process.env

// start server
console.info('Listening on port', PORT)
const server = app.listen(PORT)
