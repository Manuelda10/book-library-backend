const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test'
    ? process.env.MONGO_DB_URI_TEST
    : process.env.MONGO_DB_URI

//Conectando a MongoDB
mongoose.connect(connectionString)
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.log(err)
    })

process.on('uncaughtException', () => {
    mongoose.connection.disconnect()
})