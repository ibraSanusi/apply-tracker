import { insert, update } from "../utils/db.js"

export async function insertApplication(application, db) {
    return await insert({ data: application, model: 'JobApplication' }, db)
}

export async function deleteApplication(id, db) {
    const result = await db.query('DELETE FROM "JobApplication" WHERE id = $1', [id])
    return result.rowCount
}

export async function findApplicationById(id, db) {
    const query = `
        SELECT * 
        FROM "JobApplication" 
        WHERE id = $1 
    `
    const result = await db.query(query, [id])
    return result.rows[0]
}

export async function getApplications(userId, db) {
    const query = `
        SELECT * 
        FROM "JobApplication" 
        WHERE "userId" = $1 
    `
    const result = await db.query(query, [userId])
    return result.rows
}

export async function updateApplication(id, data, db) {
    return await update({ model: 'JobApplication', data, id }, db)
}

export async function findApplicationsToFollowUp(date, db) {
    const query = `
        SELECT ja.*, u.email as "userEmail", u.name as "userName"
        FROM "JobApplication" ja
        JOIN "User" u ON ja."userId" = u.id
        WHERE ja."createdAt"::date = $1::date
        AND ja.status = 'applied'
        AND ja.email IS NOT NULL
    `
    const result = await db.query(query, [date])
    return result.rows
}