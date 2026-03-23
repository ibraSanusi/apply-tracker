import { findUsers, registerUser } from "../repositories/userRepository.js"

export async function getAllUsersService() {
    return await findUsers()
}

export async function registerUserService(userData) {
    return await registerUser(userData)
}