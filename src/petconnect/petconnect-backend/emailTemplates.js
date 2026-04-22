// emailTemplates.js
// Beautiful HTML email templates for every notification PetConnect+ sends

// ── Shared header/footer wrappers ───────────────────────────────────────────
function wrap(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f0f9ff;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0369a1,#0c4a6e);border-radius:18px 18px 0 0;padding:32px 40px;text-align:center;">
            <span style="font-size:2rem;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
              PetConnect<span style="background:#0ea5e9;padding:2px 8px;border-radius:7px;font-size:1rem;vertical-align:middle;margin-left:4px;">+</span>
            </span>
            <p style="color:rgba(186,230,253,0.85);margin:6px 0 0;font-size:0.88rem;">Every pet deserves a loving home 🐾</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#e0f2fe;border-radius:0 0 18px 18px;padding:20px 40px;text-align:center;">
            <p style="color:#4a7fa0;font-size:0.78rem;margin:0;">
              © 2026 PetConnect+ · This email was sent as part of the pet adoption process.<br/>
              Please do not reply directly to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function h2(text) {
  return `<h2 style="font-size:1.5rem;font-weight:800;color:#0c4a6e;margin:0 0 10px;">${text}</h2>`;
}
function p(text) {
  return `<p style="color:#4a7fa0;font-size:0.95rem;line-height:1.65;margin:0 0 16px;">${text}</p>`;
}
function pill(text, bg='#e0f2fe', color='#0369a1') {
  return `<span style="display:inline-block;background:${bg};color:${color};font-size:0.78rem;font-weight:700;padding:4px 12px;border-radius:99px;letter-spacing:0.5px;">${text}</span>`;
}
function infoRow(label, value) {
  return `<tr>
    <td style="padding:8px 14px;font-size:0.83rem;font-weight:700;color:#0369a1;white-space:nowrap;border-bottom:1px solid #e0f2fe;">${label}</td>
    <td style="padding:8px 14px;font-size:0.88rem;color:#0c2d45;border-bottom:1px solid #e0f2fe;">${value || '—'}</td>
  </tr>`;
}
function btn(text, href) {
  return `<a href="${href}" style="display:inline-block;background:#0ea5e9;color:#ffffff;font-weight:700;font-size:0.95rem;padding:13px 32px;border-radius:99px;text-decoration:none;box-shadow:0 4px 14px rgba(14,165,233,0.35);margin-top:8px;">${text}</a>`;
}
function checklistHtml(tasks) {
  if (!tasks || tasks.length === 0) return '';
  const rows = tasks.map(t =>
    `<tr><td style="padding:7px 14px;font-size:0.85rem;color:#0c2d45;border-bottom:1px solid #f0f9ff;">
      <span style="color:#059669;font-weight:700;margin-right:8px;">✓</span>${t}
    </td></tr>`
  ).join('');
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border-radius:12px;overflow:hidden;margin:12px 0;">${rows}</table>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1 — Owner receives care form from adoption agency
// ─────────────────────────────────────────────────────────────────────────────
function ownerCareFormEmail({ ownerName, petName, petBreed, agencyName,
  feedingSchedule, medications, vetContact, notes, checklist, sitterLink }) {
  const body = `
    <div style="margin-bottom:24px;">
      ${pill('📋 Care Reminder Form', '#e0f2fe', '#0369a1')}
    </div>
    ${h2(`Hi ${ownerName}, your pet care form is ready!`)}
    ${p(`<strong>${agencyName}</strong> has prepared a care reminder for <strong>${petName}</strong>. 
        Please review the details below, then forward the sitter link to whoever will be caring for ${petName}.`)}

    <!-- Pet Details -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border-radius:14px;overflow:hidden;margin:20px 0;">
      ${infoRow('🐾 Pet Name', petName)}
      ${infoRow('🐶 Breed / Type', petBreed)}
      ${infoRow('🏥 Adoption Center', agencyName)}
      ${infoRow('🍽️ Feeding Schedule', feedingSchedule)}
      ${infoRow('💊 Medications', medications)}
      ${infoRow('🏨 Vet Contact', vetContact)}
    </table>

    ${notes ? `<div style="background:#f0f9ff;border-left:4px solid #38bdf8;border-radius:0 12px 12px 0;padding:14px 18px;margin:16px 0;">
      <p style="font-size:0.82rem;font-weight:700;color:#0369a1;margin:0 0 6px;">ADDITIONAL NOTES</p>
      <p style="font-size:0.88rem;color:#0c2d45;margin:0;line-height:1.6;">${notes}</p>
    </div>` : ''}

    ${checklist && checklist.length ? `
      <p style="font-size:0.85rem;font-weight:700;color:#0369a1;margin:20px 0 6px;text-transform:uppercase;letter-spacing:0.8px;">Daily Care Checklist for Your Sitter</p>
      ${checklistHtml(checklist)}
    ` : ''}

    <div style="background:#0c4a6e;border-radius:16px;padding:24px 28px;margin:28px 0;text-align:center;">
      <p style="color:rgba(186,230,253,0.9);font-size:0.88rem;margin:0 0 14px;">
        Forward this link to your pet sitter so they can complete the care checklist:
      </p>
      ${btn('📋 Open Sitter Form', sitterLink)}
      <p style="color:rgba(186,230,253,0.6);font-size:0.75rem;margin:12px 0 0;">
        Or copy this link: <span style="color:#7dd3fc;">${sitterLink}</span>
      </p>
    </div>

    ${p('Once your sitter submits the completed form, both you and ' + agencyName + ' will receive a confirmation email automatically.')}
  `;
  return wrap(`Care Form for ${petName} — PetConnect+`, body);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2 — Sitter receives the care form link
// ─────────────────────────────────────────────────────────────────────────────
function sitterCareFormEmail({ sitterEmail, ownerName, petName, petBreed,
  feedingSchedule, medications, vetContact, notes, checklist, sitterLink }) {
  const body = `
    <div style="margin-bottom:24px;">
      ${pill('🐾 Pet Sitter Instructions', '#d1fae5', '#059669')}
    </div>
    ${h2(`Care instructions for ${petName}`)}
    ${p(`<strong>${ownerName}</strong> has shared pet care instructions with you for <strong>${petName}</strong>. 
        Please review everything below and then click the button to complete the care checklist once you've taken care of ${petName}.`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border-radius:14px;overflow:hidden;margin:20px 0;">
      ${infoRow('🐾 Pet Name', petName)}
      ${infoRow('🐶 Breed / Type', petBreed)}
      ${infoRow('🍽️ Feeding Schedule', feedingSchedule)}
      ${infoRow('💊 Medications', medications)}
      ${infoRow('🏨 Emergency Vet', vetContact)}
    </table>

    ${notes ? `<div style="background:#f0f9ff;border-left:4px solid #34d399;border-radius:0 12px 12px 0;padding:14px 18px;margin:16px 0;">
      <p style="font-size:0.82rem;font-weight:700;color:#059669;margin:0 0 6px;">OWNER'S NOTES</p>
      <p style="font-size:0.88rem;color:#0c2d45;margin:0;line-height:1.6;">${notes}</p>
    </div>` : ''}

    ${checklist && checklist.length ? `
      <p style="font-size:0.85rem;font-weight:700;color:#0369a1;margin:20px 0 6px;text-transform:uppercase;letter-spacing:0.8px;">Your Daily Checklist</p>
      ${checklistHtml(checklist)}
    ` : ''}

    <div style="text-align:center;margin:28px 0;">
      <p style="color:#4a7fa0;font-size:0.88rem;margin:0 0 16px;">When you've completed care for ${petName}, click below to submit your report:</p>
      ${btn('✅ Complete & Submit Care Report', sitterLink)}
    </div>

    ${p(`If you have any questions or concerns about ${petName}'s care, please contact ${ownerName} directly.`)}
  `;
  return wrap(`Sitter Instructions for ${petName} — PetConnect+`, body);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3 — Owner confirmation that sitter completed the form
// ─────────────────────────────────────────────────────────────────────────────
function ownerCompletionEmail({ ownerName, petName, sitterName, sitterEmail,
  completedDate, completedTasks, sitterNotes }) {
  const body = `
    <div style="margin-bottom:24px;">
      ${pill('✅ Care Completed', '#d1fae5', '#059669')}
    </div>
    ${h2(`Great news — ${petName}'s care is complete!`)}
    ${p(`Hi <strong>${ownerName}</strong>, your sitter <strong>${sitterName}</strong> has completed the care checklist for <strong>${petName}</strong> and submitted their report.`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border-radius:14px;overflow:hidden;margin:20px 0;">
      ${infoRow('🐾 Pet', petName)}
      ${infoRow('👤 Sitter', `${sitterName} (${sitterEmail})`)}
      ${infoRow('📅 Date Completed', completedDate)}
      ${infoRow('✅ Tasks Completed', `${completedTasks.length} item${completedTasks.length !== 1 ? 's' : ''}`)}
    </table>

    ${completedTasks.length ? `
      <p style="font-size:0.85rem;font-weight:700;color:#0369a1;margin:20px 0 6px;text-transform:uppercase;letter-spacing:0.8px;">Completed Tasks</p>
      ${checklistHtml(completedTasks)}
    ` : ''}

    ${sitterNotes ? `<div style="background:#f0f9ff;border-left:4px solid #34d399;border-radius:0 12px 12px 0;padding:14px 18px;margin:16px 0;">
      <p style="font-size:0.82rem;font-weight:700;color:#059669;margin:0 0 6px;">SITTER'S NOTES</p>
      <p style="font-size:0.88rem;color:#0c2d45;margin:0;line-height:1.6;">${sitterNotes}</p>
    </div>` : ''}

    ${p(`You're all set! If you have any questions about the care report, you can reach your sitter at <a href="mailto:${sitterEmail}" style="color:#0ea5e9;">${sitterEmail}</a>.`)}
  `;
  return wrap(`${petName}'s Care Complete — PetConnect+`, body);
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4 — Agency confirmation that sitter completed the form
// ─────────────────────────────────────────────────────────────────────────────
function agencyCompletionEmail({ agencyName, petName, ownerName, ownerEmail,
  sitterName, sitterEmail, completedDate, completedTasks, sitterNotes }) {
  const body = `
    <div style="margin-bottom:24px;">
      ${pill('🏥 Agency Notification', '#e0f2fe', '#0369a1')}
    </div>
    ${h2(`Adoption care report received — ${petName}`)}
    ${p(`Hello <strong>${agencyName}</strong>, this is an automated confirmation that the pet sitter for one of your recently adopted pets has completed and submitted their care checklist.`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;border-radius:14px;overflow:hidden;margin:20px 0;">
      ${infoRow('🐾 Pet', petName)}
      ${infoRow('👤 Owner', `${ownerName} (${ownerEmail})`)}
      ${infoRow('🤝 Sitter', `${sitterName} (${sitterEmail})`)}
      ${infoRow('📅 Completed', completedDate)}
      ${infoRow('✅ Tasks', `${completedTasks.length} completed`)}
    </table>

    ${completedTasks.length ? `
      <p style="font-size:0.85rem;font-weight:700;color:#0369a1;margin:20px 0 6px;text-transform:uppercase;letter-spacing:0.8px;">Completed Tasks</p>
      ${checklistHtml(completedTasks)}
    ` : ''}

    ${sitterNotes ? `<div style="background:#f0f9ff;border-left:4px solid #38bdf8;border-radius:0 12px 12px 0;padding:14px 18px;margin:16px 0;">
      <p style="font-size:0.82rem;font-weight:700;color:#0369a1;margin:0 0 6px;">SITTER'S NOTES</p>
      <p style="font-size:0.88rem;color:#0c2d45;margin:0;line-height:1.6;">${sitterNotes}</p>
    </div>` : ''}

    ${p('This record has been logged automatically. No action is required unless there are concerns.')}
  `;
  return wrap(`Care Report: ${petName} — PetConnect+`, body);
}

module.exports = {
  ownerCareFormEmail,
  sitterCareFormEmail,
  ownerCompletionEmail,
  agencyCompletionEmail,
};