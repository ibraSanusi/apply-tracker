import Fastify from 'fastify'
import userRoutes from './routes/userRoutes.js'
import db from './db.js'

export async function buildApp(opts = {}) {
    const app = Fastify(opts)
    app.decorate('db', db)
    await app.register(userRoutes, { prefix: '/users' })
    return app
}

export default buildApp