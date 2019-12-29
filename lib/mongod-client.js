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

const findOne = async (code, where = {}, order = {}) => {
  const { db, client } = await connectDB()
  const collection = db.collection(`${COLLECTION_NAME_PREFIX}${code}`)
  return new Promise(function (resolve, reject) {
    collection.find(where).sort(order).limit(1).toArray(function(err, docs) {
      closeDB(client)
      if (err) { reject(err); return }
      resolve(docs[0])
    });
  })
}

const find = async (code, where = {}, order = {}) => {
  const { db, client } = await connectDB()
  const collection = db.collection(`${COLLECTION_NAME_PREFIX}${code}`)
  return new Promise(function (resolve, reject) {
    collection.find(where).sort(order).toArray(function(err, docs) {
      closeDB(client)
      if (err) { reject(err); return }
      resolve(docs)
    });
  })
}


const insert = async (code, data) => {
  const { db, client } = await connectDB()
  const collection = db.collection(`${COLLECTION_NAME_PREFIX}${code}`)
  return new Promise(function (resolve, reject) {
    collection.insertMany(data , function(err, result) {
      closeDB(client)
      if (err) { reject(err); return }
      console.log(data)
      resolve(true)
    })
  })
}

const multiUpdate = async (code, array) => {
  const { db, client } = await connectDB()
  const collection = db.collection(`${COLLECTION_NAME_PREFIX}${code}`)
  return new Promise(function (resolve, reject) {
    array.forEach(async (stock, i) => {
      try {
        await (() => {
          return new Promise(function (res, rej) {
            collection.updateOne({"_id": stock._id}, {$set: {...stock}}, (err) => {
              if (err) { return; rej(err) }
              console.log(stock)
              res(true)
            })
          })
        })()

        // Last
        if (i + 1 === array.length) {
          closeDB(client)
          resolve(true)
        }
      } catch(e) {
        reject(e)
        return false
      }
    })
  })
}

module.exports = {
  find,
  findOne,
  insert,
  multiUpdate,
}
