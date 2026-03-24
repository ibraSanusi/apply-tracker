export const registerSchema = {
    body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
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
                        created_at: { type: 'string', format: 'date-time' }
                    }
                }
            }
        }
    }
}