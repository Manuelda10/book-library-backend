const mongoose = require('mongoose')
const { server } = require('../index')
const User = require('../models/User')
const { initialUsers, api } = require('./helpers/helpers')

beforeEach(async () => {
    await User.deleteMany({})

    //parallel
    /*
    const usersObjects = initialUsers.map(user => new User(user))
    const promises = usersObjects.map(user => user.save())
    await Promise.all(promises)*/

    //sequencial
    for (const user of initialUsers) {
        const userObject = new User(user)
        await userObject.save()
    }
})

test('users are returned as json', async () => {
    await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two users', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(2)
})

test('the first note is about manuel', async () => {
    const response = await api.get('/api/users')
    const names = response.body.map(user => user.name)
    expect(names[0]).toBe('manuel')
})

test('a valid user can be added', async () => {
    const newUser = {
        email: 'vallejos@yopmail.com',
        password: 'vallejos123',
        name: 'vallejos'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    //Obtenemos todas las notas para verificar el post
    const response = await api.get('/api/users') 
    const names = response.body.map(user => user.name)

    expect(response.body).toHaveLength(initialUsers.length + 1)
    expect(names).toContain(newUser.name)
})

test('a user without any of its values can not be added', async () => {
    const newUser = {
        email: 'vallejos@yopmail.com',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
    
    //Obtenemos todas las notas para verificar el post
    const response = await api.get('/api/users') 

    expect(response.body).toHaveLength(initialUsers.length)
})

test('a user can be deleted', async () => {
    const response = await api.get('/api/users')
    const userToDelete = response.body[0]

    await api
        .delete(`/api/users/${userToDelete.id}`)
        .expect(204)
    
    const responseAfter = await api.get('/api/users')
    expect(responseAfter.body).toHaveLength(initialUsers.length - 1)

    const names = responseAfter.body.map(user => user.name)
    expect(names).not.toContain(userToDelete.name)
})

test('a user that do not exist can not be deleted', async () => {
    await api
        .delete('/api/users/1234')
        .expect(400)
    
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(initialUsers.length)
})

afterAll( () => {
    mongoose.connection.close()
    server.close()
})