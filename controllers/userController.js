import { getAllUsersService, registerUserService } from "../services/userService.js"

export async function wellcomeCtrl(request, reply) {
    const user = await getAllUsersService()
    reply.send({ data: user })
}

export async function registerCtrl(request, reply) {
    try {
        const user = await registerUserService(request.body)
        reply.code(201).send({ data: user })
    } catch (error) {
        reply.code(500).send({ message: 'Error registering user', error: error.message })
    }
}