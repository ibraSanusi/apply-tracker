import { afterEach, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert'
import buildApp from '../app.js'

describe('Users', () => {
    let app
    let email = 'ibra@test.es'
    let password = '12345678'

    beforeEach(async () => {
        app = await buildApp()
    })

    afterEach(async () => {
        await app.db.query('DELETE FROM "User" WHERE email = $1', [email])
        await app.close()
    })

    it('POST /users/register should register a new user', async () => {
        const payload = {
            name: 'Ibrahim',
            lastName: 'Sanusi',
            email,
            password,
        }

        const response = await app.inject({
            method: 'POST',
            url: '/users/register',
            payload
        })

        const { data } = JSON.parse(response.body)
        assert.strictEqual(data.email, payload.email)
    })
})