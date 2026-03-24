import { wellcomeCtrl, registerCtrl } from "../controllers/userController.js"
import { registerSchema } from "../schemas/userSchema.js"

async function usersRoutes(fastify, options) {
    fastify.get('/', wellcomeCtrl)
    fastify.post('/register', { schema: registerSchema }, registerCtrl)
}

export default usersRoutes