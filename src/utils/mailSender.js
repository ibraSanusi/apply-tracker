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
    transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        text: `
            <h1>Email de verificación</h1>
            <p>Clicke en el enlace para verificar su mail</p>

            <a href="${process.env.FRONT_URL}/verify-email?verificationMail=${token}"></a>
        `
    })
}