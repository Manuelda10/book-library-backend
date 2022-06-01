const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
    email: String,
    password: String,
    name: String,
})

/*Tener un lugar con tu biblioteca de libros sugeridos*/ 

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const User = model('User', userSchema)

module.exports = User