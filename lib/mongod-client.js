const MongoClient = require('mongodb').MongoClient
// const assert = require('assert')

const MONGODB_URL = 'mongodb://localhost:27017'
const DB_NAME = 'stock'
const COLLECTION_NAME_PREFIX = 's'
const DB_OPTIONS = { useUnifiedTopology : true, useNewUrlParser : true }

const connectDB = () => {
  return new Promise(function (resolve, reject) {
    // Use connect method to connect to the server
    MongoClient.connect(MONGODB_URL, DB_OPTIONS, function(err, client) {
      // assert.equal(null, err)
      if (err) { reject(err); return }
      console.log('** Connected successfully to mongoDB **')
      const db = client.db(DB_NAME)
      resolve({db: db, client: client })
    })
  })
}

const closeDB = (client) => {
  client.close()
  console.log('** Closed mongoDB successfully **')
}

const insertData = async (code, data) => {
  const { db, client } = await connectDB()
  const collection = db.collection(`${COLLECTION_NAME_PREFIX}${code}`)
  return new Promise(function (resolve, reject) {
    collection.insertMany(data , function(err, result) {
      closeDB(client)
      if (err) { reject(err); return }
      console.log(data)
      resolve(true)
    });
  });
}


module.exports = {
  insert: insertData
}
