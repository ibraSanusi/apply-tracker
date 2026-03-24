import { findUsers, registerUser } from "../repositories/userRepository.js"

export async function getAllUsersService() {
    return await findUsers()
}

export async function registerUserService(userData, db) {
    return await registerUser(userData, db)
}