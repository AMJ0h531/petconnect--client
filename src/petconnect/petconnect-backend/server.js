// server.js — PetConnect+ Backend
// Handles all email notification routes for the adoption care reminder system

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const { v4: uuidv4 } = require('uuid');
const { createTransport } = require('./emailTransport');
const {
  ownerCareFormEmail,
  sitterCareFormEmail,
  ownerCompletionEmail,
  agencyCompletionEmail,
} = require('./emailTemplates');

const app       = express();
const PORT      = process.env.PORT || 3001;
const FRONTEND  = process.env.FRONTEND_URL || 'http://localhost:5173';
const FROM      = process.env.EMAIL_FROM || 'PetConnect+ <noreply@petconnect.app>';

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: FRONTEND, credentials: true }));
app.use(express.json());

// ── In-memory store for pending sitter sessions ──────────────────────────────
// In production, replace this with a database (PostgreSQL, MongoDB, etc.)
const sitterSessions = new Map();
// Structure: Map<token, { petName, petBreed, ownerName, ownerEmail,
//                         agencyName, agencyEmail, feedingSchedule,
//                         medications, vetContact, notes, checklist }>

// ── Create Nodemailer transporter ────────────────────────────────────────────
let transporter;
try {
  transporter = createTransport();
} catch (err) {
  console.error('❌ Email transporter error:', err.message);
  console.error('   Check your .env file and EMAIL_PROVIDER setting.');
  process.exit(1);
}

// ── Helper: send one email ───────────────────────────────────────────────────
async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({ from: FROM, to, subject, html });
  console.log(`✉️  Sent "${subject}" → ${to}`);
}

// ── Input validation helper ──────────────────────────────────────────────────
function requireFields(body, fields) {
  const missing = fields.filter(f => !body[f] || String(body[f]).trim() === '');
  return missing.length ? missing : null;
}

// ════════════════════════════════════════════════════════════════════════════
//  ROUTE 1 — POST /api/send-care-form
//  Adoption agency fills out the form and sends it to the owner.
//  The owner gets a full care details email with a sitter link to forward.
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/send-care-form', async (req, res) => {
  const missing = requireFields(req.body, [
    'petName', 'ownerName', 'ownerEmail', 'agencyName', 'agencyEmail',
  ]);
  if (missing) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const {
    petName, petBreed, ownerName, ownerEmail,
    agencyName, agencyEmail,
    feedingSchedule, medications, vetContact, notes,
    checklist = [],
  } = req.body;

  // Generate a unique token for the sitter session
  const token = uuidv4();
  const sitterLink = `${FRONTEND}/sitter?token=${token}`;

  // Store session so the sitter page can load the data later
  sitterSessions.set(token, {
    petName, petBreed, ownerName, ownerEmail,
    agencyName, agencyEmail,
    feedingSchedule, medications, vetContact, notes,
    checklist,
    createdAt: new Date().toISOString(),
  });

  // Auto-expire session after 30 days
  setTimeout(() => sitterSessions.delete(token), 30 * 24 * 60 * 60 * 1000);

  try {
    // Send care form email to owner
    await sendEmail({
      to: ownerEmail,
      subject: `🐾 ${petName}'s Care Instructions — Action Required`,
      html: ownerCareFormEmail({
        ownerName, petName, petBreed, agencyName,
        feedingSchedule, medications, vetContact, notes,
        checklist, sitterLink,
      }),
    });

    console.log(`📋 Care form session created: token=${token} pet=${petName} owner=${ownerEmail}`);
    res.json({ success: true, message: `Care form sent to ${ownerEmail}`, token, sitterLink });

  } catch (err) {
    console.error('❌ Failed to send care form:', err.message);
    res.status(500).json({ error: 'Failed to send email. Check your email provider settings.' });
  }
});


// ════════════════════════════════════════════════════════════════════════════
//  ROUTE 2 — POST /api/forward-to-sitter
//  Owner forwards the sitter link to their sitter's email address.
//  The sitter receives a dedicated email with care info + the form link.
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/forward-to-sitter', async (req, res) => {
  const missing = requireFields(req.body, ['token', 'sitterEmail']);
  if (missing) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const { token, sitterEmail } = req.body;
  const session = sitterSessions.get(token);
  if (!session) {
    return res.status(404).json({ error: 'Session not found or expired. Please ask the adoption center to resend.' });
  }

  const sitterLink = `${FRONTEND}/sitter?token=${token}`;

  try {
    await sendEmail({
      to: sitterEmail,
      subject: `🐾 Pet Care Instructions for ${session.petName}`,
      html: sitterCareFormEmail({
        sitterEmail,
        ownerName: session.ownerName,
        petName:   session.petName,
        petBreed:  session.petBreed,
        feedingSchedule: session.feedingSchedule,
        medications:     session.medications,
        vetContact:      session.vetContact,
        notes:           session.notes,
        checklist:       session.checklist,
        sitterLink,
      }),
    });

    // Save sitter email on the session for the completion step
    session.sitterEmail = sitterEmail;
    sitterSessions.set(token, session);

    res.json({ success: true, message: `Care form forwarded to sitter at ${sitterEmail}` });

  } catch (err) {
    console.error('❌ Failed to forward to sitter:', err.message);
    res.status(500).json({ error: 'Failed to send email to sitter.' });
  }
});


// ════════════════════════════════════════════════════════════════════════════
//  ROUTE 3 — GET /api/sitter-session/:token
//  The sitter page calls this to load the pet care details for display.
// ════════════════════════════════════════════════════════════════════════════
app.get('/api/sitter-session/:token', (req, res) => {
  const session = sitterSessions.get(req.params.token);
  if (!session) {
    return res.status(404).json({ error: 'Session not found or expired.' });
  }
  // Return everything except the agency email (sitter doesn't need it)
  const { agencyEmail, ...safeSession } = session;
  res.json(safeSession);
});


// ════════════════════════════════════════════════════════════════════════════
//  ROUTE 4 — POST /api/complete-care
//  Sitter submits their completed checklist.
//  BOTH the owner AND the adoption agency receive a confirmation email.
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/complete-care', async (req, res) => {
  const missing = requireFields(req.body, ['token', 'sitterName', 'sitterEmail']);
  if (missing) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const { token, sitterName, sitterEmail, completedTasks = [], sitterNotes = '' } = req.body;
  const session = sitterSessions.get(token);
  if (!session) {
    return res.status(404).json({ error: 'Session not found or expired.' });
  }

  const completedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const sharedData = {
    petName:        session.petName,
    ownerName:      session.ownerName,
    ownerEmail:     session.ownerEmail,
    agencyName:     session.agencyName,
    sitterName,
    sitterEmail,
    completedDate,
    completedTasks,
    sitterNotes,
  };

  try {
    // Send both emails concurrently
    await Promise.all([
      // Notify owner
      sendEmail({
        to: session.ownerEmail,
        subject: `✅ ${session.petName}'s care has been completed`,
        html: ownerCompletionEmail(sharedData),
      }),
      // Notify adoption agency
      sendEmail({
        to: session.agencyEmail,
        subject: `📋 Care Report Submitted — ${session.petName} (${session.ownerName})`,
        html: agencyCompletionEmail(sharedData),
      }),
    ]);

    // Mark session as completed (keep for record, but flag it)
    session.completedAt = new Date().toISOString();
    session.completedBy = { sitterName, sitterEmail };
    sitterSessions.set(token, session);

    console.log(`✅ Care completed: pet=${session.petName} sitter=${sitterEmail} → notified owner + agency`);
    res.json({
      success: true,
      message: `Completion emails sent to ${session.ownerEmail} and ${session.agencyEmail}`,
    });

  } catch (err) {
    console.error('❌ Failed to send completion emails:', err.message);
    res.status(500).json({ error: 'Failed to send completion notifications.' });
  }
});


// ════════════════════════════════════════════════════════════════════════════
//  ROUTE 5 — POST /api/verify-email
//  Optional: test that your email credentials work before going live
// ════════════════════════════════════════════════════════════════════════════
app.post('/api/verify-email', async (req, res) => {
  const { testEmail } = req.body;
  if (!testEmail) return res.status(400).json({ error: 'Provide a testEmail address.' });

  try {
    await sendEmail({
      to: testEmail,
      subject: '✅ PetConnect+ Email Test',
      html: `<div style="font-family:sans-serif;padding:40px;text-align:center;">
        <h2 style="color:#0369a1;">🐾 Email is working!</h2>
        <p style="color:#4a7fa0;">Your PetConnect+ backend is configured correctly.</p>
        <p style="color:#4a7fa0;font-size:0.85rem;">Provider: <strong>${process.env.EMAIL_PROVIDER || 'gmail'}</strong></p>
      </div>`,
    });
    res.json({ success: true, message: `Test email sent to ${testEmail}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: process.env.EMAIL_PROVIDER || 'gmail',
    sessions: sitterSessions.size,
    uptime: Math.floor(process.uptime()) + 's',
  });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 PetConnect+ backend running on http://localhost:${PORT}`);
  console.log(`   Email provider : ${process.env.EMAIL_PROVIDER || 'gmail'}`);
  console.log(`   Frontend origin: ${FRONTEND}`);
  console.log(`   Routes ready:`);
  console.log(`     POST /api/send-care-form     — Agency → Owner`);
  console.log(`     POST /api/forward-to-sitter  — Owner  → Sitter`);
  console.log(`     GET  /api/sitter-session/:t  — Load session`);
  console.log(`     POST /api/complete-care      — Sitter submits → Owner + Agency notified`);
  console.log(`     POST /api/verify-email       — Test your email setup`);
  console.log(`     GET  /api/health             — Health check\n`);
});