import Fastify from 'fastify'
import userRoute from './routes/userRoute.js'
import db from './db.js'
import applicationRoute from './routes/applicationRoute.js'

export async function buildApp(opts = {}) {
    const app = Fastify(opts)
    app.decorate('db', db)
    await app.register(userRoute, { prefix: '/users' })
    await app.register(applicationRoute, { prefix: '/applications' })
    return app
}

export default buildApp