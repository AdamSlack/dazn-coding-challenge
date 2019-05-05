
const MemoryDB = require('./providers/memorydb')
const MongoDB = require('./providers/mongodb')
const AbstractDB = require('./providers/db')

module.exports = {
  db: (() => {
    if (process.env.DB_PROVIDER === 'MEMORY_DB') return new MemoryDB()
    if (process.env.DB_PROVIDER === 'MONGO_DB') return new MongoDB()
    return new MemoryDB() // default to in memory db
  })()
}
