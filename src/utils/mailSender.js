import "dotenv/config.js";
import { createTransport } from "nodemailer";

// Create a transporter using SMTP
export const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export function sendVerificationTokenMail({ email, token }) {
    if (process.env.NODE_ENV === 'test') return 'test'

    return transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Verifica tu email',
        html: `
            <h1>Email de verificación</h1>
            <p>Clickea en el enlace para verificar tu mail</p>
            <a href="${process.env.FRONT_URL}/verify-email?verificationMail=${token}">
                Verificar email
            </a>
        `
    })
}