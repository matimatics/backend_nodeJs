/* eslint-env node, jest */
const mongoose = require("mongoose");
const { server } = require("../index");
const bcrypt = require('bcrypt')
const {User} = require('../models/User')
const {api, getUsers} = require('./helpers')

describe.only('Creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('pswd', 10)
        const user = new User({username: 'matiroot', passwordHash})
        await user.save()
    })

    test('Works as expected with new username', async () => {
        const usersAtStart = await getUsers()
        const newUser = {
            username: 'mati',
            lastname: 'vargas',
            password: 'twitch1'
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })

    test('Users creation failed if username is already taken', async () => {
        const usersAtStart = await getUsers()
        const newUser = {username: 'matiroot', lastname: 'blahblah', password: '123'}

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.errors.username.message)
            .toContain('expected `username` to be unique')
        const usersAtEnd = await getUsers()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close();
    server.close();
  });