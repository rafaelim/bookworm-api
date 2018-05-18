import nodemailer from 'nodemailer';

const from = '"Bookworm" <info@bookworm.com>';

function setup() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

export function sendConfirmationEmail(user) {
    const transport = setup();
    const email = {
        from,
        to: user.email,
        subject: "Welcome to bookworm",
        text: `
            Welcome to bookworm. Please, confirm your email.

            ${user.generateConfirmationUrl()}
        `
    };
    transport.sendMail(email);
}

export function sendResetPasswordEmail(user) {
    const transport = setup();
    const email = {
        from,
        to: user.email,
        subject: "Reset Password",
        text: `
            To reset password follow this link.

            ${user.generateResetPasswordLink()}
        `
    };
    transport.sendMail(email);
}
