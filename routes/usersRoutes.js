import { wellcomeCtrl, registerCtrl } from "../controllers/userController.js"

async function usersRoutes(fastify, options) {
    fastify.get('/', wellcomeCtrl)
    fastify.post('/register', registerCtrl)
}

export default usersRoutes