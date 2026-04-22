// emailTransport.js
// Builds the correct Nodemailer transport based on EMAIL_PROVIDER in .env

const nodemailer = require('nodemailer');

function createTransport() {
  const provider = (process.env.EMAIL_PROVIDER || 'gmail').toLowerCase();

  switch (provider) {

    // ── Gmail ───────────────────────────────────────────────────────────
    case 'gmail':
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS, // Use an App Password, not your real password
        },
      });

    // ── SendGrid ────────────────────────────────────────────────────────
    case 'sendgrid':
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',                         // This string is literal — do not change
          pass: process.env.SENDGRID_API_KEY,
        },
      });

    // ── Resend ──────────────────────────────────────────────────────────
    case 'resend':
      return nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
          user: 'resend',                         // This string is literal — do not change
          pass: process.env.RESEND_API_KEY,
        },
      });

    // ── Generic SMTP (Mailgun, Outlook, custom) ─────────────────────────
    case 'smtp':
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    default:
      throw new Error(`Unknown EMAIL_PROVIDER: "${provider}". Choose gmail, sendgrid, resend, or smtp.`);
  }
}

module.exports = { createTransport };