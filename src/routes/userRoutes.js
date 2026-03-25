import { welcomeCtrl, registerCtrl, loginCtrl, verifyEmailCtrl, sendVerificationEmailCtrl } from "../controllers/userController.js"
import { registerSchema, loginSchema, verifyEmailSchema, sendVerificationEmailSchema } from "../schemas/userSchema.js"

async function userRoutes(fastify) {
    fastify.get('/', welcomeCtrl)
    fastify.post('/register', { schema: registerSchema }, registerCtrl)
    fastify.post('/verify-email', { schema: verifyEmailSchema }, verifyEmailCtrl)
    fastify.post('/send-verification-mail', { schema: sendVerificationEmailSchema }, sendVerificationEmailCtrl)
    fastify.post('/login', { schema: loginSchema }, loginCtrl)
}

export default userRoutes