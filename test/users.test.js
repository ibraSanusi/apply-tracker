import { after, before, describe, it } from 'node:test'
import assert from 'node:assert'
import buildApp from '../src/app.js'
import { findUserByEmail } from '../src/repositories/userRepository.js'

describe('Users', () => {
    let app
    let verifyToken
    let recoveryToken
    let userId
    let email = 'ibra@test.es'
    let password = '12345678'
    let newPassword = 'newPassword'

    before(async () => {
        app = await buildApp()
        process.env.NODE_ENV = 'test'
    })

    after(async () => {
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

        assert.strictEqual(response.statusCode, 201)
        const { data } = JSON.parse(response.body)
        assert.strictEqual(data.email, payload.email)

        // para los test de mas tarde
        verifyToken = data.verifyToken
        userId = data.id
    })

    describe('POST /users/register', () => {
        it('should register a new user', async () => {
            const emailReg = `test-${Date.now()}@test.es`
            const payload = {
                name: 'Ibrahim',
                lastName: 'Sanusi',
                email: emailReg,
                password,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/register',
                payload
            })

            assert.strictEqual(response.statusCode, 201)
            const { data } = JSON.parse(response.body)
            assert.strictEqual(data.email, payload.email)

            // Cleanup
            await app.db.query('DELETE FROM "User" WHERE email = $1', [emailReg])
        })

        it('should return 400 for missing required fields', async () => {
            const payload = {
                name: 'Ibrahim',
                // email missing
                password,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/register',
                payload
            })

            assert.strictEqual(response.statusCode, 400)
        })

        it('should return 500 for duplicate email', async () => {
            const payload = {
                name: 'Ibrahim duplicate',
                lastName: 'Sanusi',
                email,
                password,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/register',
                payload
            })

            assert.strictEqual(response.statusCode, 500)
        })
    })

    describe('POST /users/login', () => {
        it('should login a user', async () => {
            const payload = {
                email,
                password,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/login',
                payload,
            })

            assert.strictEqual(response.statusCode, 200)
            const { data, token } = JSON.parse(response.body)

            assert.strictEqual(data.email, email)

            const foundUser = await findUserByEmail(email, app.db)
            assert.strictEqual(foundUser.token, token)
            assert.ok(foundUser.tokenExpiry > new Date())
        })

        it('should return 401 for invalid credentials', async () => {
            const payload = {
                email,
                password: 'wrongpassword',
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/login',
                payload,
            })

            assert.strictEqual(response.statusCode, 401)
        })

        it('should return 400 for missing fields', async () => {
            const payload = {
                email,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/login',
                payload,
            })

            assert.strictEqual(response.statusCode, 400)
        })
    })

    describe('POST /users/verify-email', () => {
        it('should verify the email', async () => {
            const payload = {
                userId,
                token: verifyToken,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/verify-email',
                payload,
            })

            assert.strictEqual(response.statusCode, 200)
        })

        it('should return 400 for missing token', async () => {
            const payload = {
                userId,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/verify-email',
                payload,
            })

            assert.strictEqual(response.statusCode, 400)
        })

        it('should return 500 for invalid token', async () => {
            const payload = {
                userId,
                token: 'invalid-token',
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/verify-email',
                payload,
            })

            assert.strictEqual(response.statusCode, 500)
        })
    })

    describe('POST /users/send-recovery-mail', () => {
        it('should send recovery password mail', async () => {
            const payload = {
                email,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/send-recovery-mail',
                payload,
            })

            assert.strictEqual(response.statusCode, 200)
            const foundUser = await findUserByEmail(email, app.db)
            recoveryToken = foundUser.recoveryToken
        })

        it('should return 500 for non-existent email', async () => {
            const payload = {
                email: 'nonexistent@test.es',
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/send-recovery-mail',
                payload,
            })

            assert.strictEqual(response.statusCode, 500)
        })
    })

    describe('POST /users/recover-password', () => {
        it('should recover the password', async () => {
            const payload = {
                newPassword,
                token: recoveryToken,
                email,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/recover-password',
                payload,
            })

            assert.strictEqual(response.statusCode, 200)
        })

        it('should return 400 for missing fields', async () => {
            const payload = {
                newPassword,
                email,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/recover-password',
                payload,
            })

            assert.strictEqual(response.statusCode, 400)
        })

        it('should return 500 for invalid token', async () => {
            const payload = {
                newPassword,
                token: 'invalid-token',
                email,
            }

            const response = await app.inject({
                method: 'POST',
                url: '/users/recover-password',
                payload,
            })

            assert.strictEqual(response.statusCode, 500)
        })
    })
})