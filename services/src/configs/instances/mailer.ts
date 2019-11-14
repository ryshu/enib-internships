import nodemailer from 'nodemailer';

// Nodemailer transport initialization
export default nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: process.env.SMTP_AUTH_USER
        ? {
              user: process.env.SMTP_AUTH_USER,
              pass: process.env.SMTP_AUTH_PASS,
          }
        : undefined,
} as any);
