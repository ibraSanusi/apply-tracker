const recoveryHtml = (token, email) => {
    return `
            <h1>Email de recuperación</h1>
            <p>Clickea en el enlace para recuperar tu contraseña</p>
            <a href="${process.env.FRONT_URL ?? 'http://localhost:5173'}/recovery-password?recoveryToken=${token}&email=${email}">
                Recuperar contraseña
            </a>
        `
}

const verificationHtml = (token) => {
    return `
            <h1>Email de verificación</h1>
            <p>Clickea en el enlace para verificar tu mail</p>
            <a href="${process.env.FRONT_URL}/verify-email?verificationMail=${token}">
                Verificar email
            </a>
        `
}

const followUpHtml = (userName, applications) => {
    const listItems = applications.map(app => `<li><strong>${app.company}</strong> - ${app.position} - ${app.email}</li>`).join('')
    return `
            <h1>¡Hola ${userName}!</h1>
            <p>Hace 7 días aplicaste a las siguientes ofertas:</p>
            <ul>
                ${listItems}
            </ul>
            <p>¿Has tenido alguna novedad sobre ellas? No olvides actualizar el estado de tus aplicaciones en la plataforma.</p>
            <p>¡Mucho éxito!</p>
        `
}

export { recoveryHtml, verificationHtml, followUpHtml }