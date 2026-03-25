import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { findUsers, insertUser, findUserByEmail, updateUserToken, updateVerifyToken, findUserById, setUserVerified } from "../repositories/userRepository.js"
import { sendVerificationTokenMail } from '../utils/mailSender.js'

dotenv.config()

export async function getAllUsersService() {
    return await findUsers()
}

export async function registerUserService(userData, db) {
    return await insertUser(userData, db)
}

export async function loginUserService(userData, db) {
    const user = await findUserByEmail(userData.email, db)
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(userData.password, user.passwordHash)
    if (!isPasswordValid) return null

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        isVerified: user.isVerified,
    }

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' })

    await updateUserToken({ id: user.id, token: jwtToken }, db)

    return { payload, jwtToken }
}

export async function sendVerificationTokenService(user, db) {
    const verifyToken = crypto.randomUUID()
    await updateVerifyToken({ id: user.id, verifyToken }, db)
    sendVerificationTokenMail({ email: user.email, token: verifyToken })

    return verifyToken
}

export async function verifyEmailService({ token, userId }, db) {
    const user = await findUserById(userId, db)
    if (Date(user.verifyTokenExpiry) < Date.now() || user.verifyToken !== token) throw new Error("Token undefined or expired");

    await setUserVerified(userId, db)
}