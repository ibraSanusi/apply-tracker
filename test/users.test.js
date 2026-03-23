import { describe, it } from 'node:test'
import assert from 'node:assert'
import buildApp from '../app.js'

describe('Users', () => {
    it('POST /users/register should register a new user', async () => {
        const app = await buildApp()
        const payload = {
            name: 'John Doe',
            email: 'ibra@test.es',
            password: 'password'
        }

        const response = await app.inject({
            method: 'POST',
            url: '/users/register',
            payload
        })

        const { data } = JSON.parse(response.body)
        assert.ok(data)
    })
})