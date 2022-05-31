require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()

app.use(express.json()) //Middleware para reconocer el objeto entrante

app.get('/', (request, response) => {
    response.send('<h1>Iniciando la API</h1>')
})

// Puerto en el que se ejecutará el servidor
const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
