export async function registerUser({ email, password, }, app) {
    const payload = {
        name: 'Ibrahim',
        lastName: 'Sanusi',
        email,
        password,
    }

    return await app.inject({
        method: 'POST',
        url: '/users/register',
        payload
    })
}

export async function loginUser({ email, password }, app) {
    const payload = {
        email,
        password,
    }

    return await app.inject({
        method: 'POST',
        url: '/users/login',
        payload,
    })
}