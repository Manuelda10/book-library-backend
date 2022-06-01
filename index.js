require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const User = require('./models/User')
const handleErrors = require('./middleware/handleErrors')

app.use(express.json()) //Middleware para reconocer el objeto entrante

app.get('/', (request, response) => {
    response.send('<h1>Iniciando la API</h1>')
})

// GET de todos los usuarios
app.get('/api/users', async (request, response) => {
    
    /*
    User.find({}).then(users => {
        response.json(users)
    })*/

    //Con async await
    const users = await User.find({})
    response.json(users)
})

// GET de un usuario específico por su ID
app.get('/api/users/:id', (request, response, next) => {
    const id = request.params.id

    User.findById(id).then(user => {
        if (user) {
            return response.json(user)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        next(err)
    })
})

// POST de usuarios
app.post('/api/users', async (request, response, next) => {
    const user = request.body

    if (!user.name) {
        return response.status(400).json({
            error: 'required "content" field is missing'
        })
    }

    const newUser = new User({
        email: user.email,
        password: user.password,
        name: user.name
    })

    /*
    newUser.save().then(savedUser => {
        response.json(savedUser)
    })*/

    //Con async await

    try {
        const savedUser = await newUser.save()
        response.json(savedUser)  
    } catch (error) {
        next(error)
    }

    
})

// DELETE de un usuario específico
app.delete('/api/users/:id', (request, response, next) => {
    const { id } = request.params

    User.findByIdAndDelete(id)
        .then(() => response.status(204).end())
        .catch(next)
})

app.use(handleErrors)

// Puerto en el que se ejecutará el servidor
const PORT = 3001

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = { app , server} 
