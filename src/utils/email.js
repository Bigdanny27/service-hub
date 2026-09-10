import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure .env is loaded in case it wasn't loaded earlier
dotenv.config();

const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465;
const EMAIL_SECURE = typeof process.env.EMAIL_SECURE !== 'undefined' ? (process.env.EMAIL_SECURE === 'true') : (EMAIL_PORT === 465);

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    logger: true,
    debug: false
});

// Log presence of credentials (masked) to help debugging without exposing secrets
console.log('EMAIL_USER set:', !!process.env.EMAIL_USER);
console.log('EMAIL_APP_PASSWORD set:', !!process.env.EMAIL_APP_PASSWORD, 'length:', process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.length : 0);
console.log('EMAIL_HOST:', EMAIL_HOST, 'EMAIL_PORT:', EMAIL_PORT, 'EMAIL_SECURE:', EMAIL_SECURE);

// Verify transporter at startup to surface configuration/auth issues early
(async () => {
    try {
        await transporter.verify();
        console.log('Email transporter verified');
    } catch (err) {
        console.error('Email transporter verification failed:', err);
    }
})();

// A reusable function to send emails
export const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: `"Service-hub" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (err) {
        console.error('Failed to send email:', err);
        throw err;
    }
};

export default transporter;