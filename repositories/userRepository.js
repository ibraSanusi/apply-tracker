import bcrypt from 'bcrypt'

export async function findUsers() {
    return 'hola desde el repositorio'
}

export async function registerUser(userData, db) {
    const { name, lastName, email, password } = userData
    const passwordHash = await bcrypt.hash(password, 10)
    const query = `
        INSERT INTO "User" ("name", "lastName", "email", "passwordHash", "createdAt", "updatedAt", "token", "tokenExpiry", "isVerified", "recoveryToken", "recoveryTokenExpiry")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, "name", "lastName", "email", "createdAt", "updatedAt", "isVerified"
    `
    const result = await db.query(query, [name, lastName, email, passwordHash, new Date(), new Date(), null, null, true, null, null])
    return result.rows[0]
}