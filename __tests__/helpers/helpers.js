const supertest = require('supertest')
const { app } = require('../../index')
const api = supertest(app)

const initialUsers = [
    {
        email: "manuel@yopmail.com",
        password: "manuel123",
        name: "manuel"
    },
    {
        email: "david@yopmail.com",
        password: "david123",
        name: "david"
    }
]

module.exports = { initialUsers, api }