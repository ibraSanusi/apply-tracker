import { getAllUsersService, registerUserService, loginUserService, sendVerificationTokenService, verifyEmailService } from "../services/userService.js"

export async function welcomeCtrl(request, reply) {
    const user = await getAllUsersService()
    reply.send({ data: user })
}

export async function registerCtrl(request, reply) {
    try {
        const user = await registerUserService(request.body, request.server.db)
        const verifyToken = await sendVerificationTokenService(user, request.server.db)

        reply.code(201).send({ data: { ...user, verifyToken } })
    } catch (error) {
        reply.code(500).send({ message: 'Error registering user' })
    }
}

export async function verifyEmailCtrl(request, reply) {
    try {
        await verifyEmailService(request.body, request.server.db)
        reply.code(200).send({ message: 'Email verified correctly' })
    } catch (error) {
        console.error('verifyEmail error:', error)
        reply.code(500).send({ message: 'Error verifying email' })
    }
}

export async function sendVerificationEmailCtrl(request, reply) {
    try {
        await sendVerificationTokenService(request.body, request.server.db)
        reply.code(200).send({ message: 'Se envío el enlace de verificación. Compruebe su mail' })
    } catch (error) {
        reply.code(500).send({ message: 'Error sending mail user' })
    }

}

export async function loginCtrl(request, reply) {
    try {
        const { payload, jwtToken } = await loginUserService(request.body, request.server.db)
        if (!payload) {
            reply.code(401).send({ message: 'Invalid credentials' })
        }
        reply.send({ data: payload, token: jwtToken })
    } catch (error) {
        reply.code(500).send({ message: 'Error logging in' })
    }
}
