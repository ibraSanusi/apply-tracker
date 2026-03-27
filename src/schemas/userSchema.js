export const registerSchema = {
    body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
        }
    },
    response: {
        201: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        created_at: { type: 'string', format: 'date-time' },
                        verifyToken: { type: 'string' },
                    }
                }
            }
        }
    }
}

export const loginSchema = {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        lastName: { type: 'string' },
                        isVerified: { type: 'boolean' }
                    }
                },
                token: { type: 'string' }
            }
        }
    }
}

export const verifyEmailSchema = {
    body: {
        type: 'object',
        required: ['token'],
        properties: {
            token: { type: 'string' },
            userId: { type: 'number' }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
}

export const sendVerificationEmailSchema = {
    body: {
        type: 'object',
        required: ['email', 'id'],
        properties: {
            id: { type: 'number' },
            email: { type: 'string', format: 'email' },
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
}

export const recoverPasswordSchema = {
    body: {
        type: 'object',
        required: ['token', 'newPassword', 'email'],
        properties: {
            token: { type: 'string' },
            newPassword: { type: 'string' },
            email: { type: 'string', format: 'email' },
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
}

export const sendRecoveryMailSchema = {
    body: {
        type: 'object',
        required: ['email'],
        properties: {
            email: { type: 'string', format: 'email' },
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    }
}