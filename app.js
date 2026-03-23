import Fastify from 'fastify'
import usersRoutes from './routes/usersRoutes.js'

export async function buildApp(opts = {}) {
    const app = Fastify(opts)
    await app.register(usersRoutes, { prefix: '/users' })
    return app
}

export default buildApp