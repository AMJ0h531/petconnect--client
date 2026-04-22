/**
 * petconnect-api.js
 * Drop this <script> block into your index.html, replacing the
 * existing sendToOwner(), generateSitterLink(), and submitSitterForm() functions.
 *
 * Set API_BASE to wherever you deploy your backend server.
 */

const API_BASE = 'http://localhost:3001'; // ← change to your deployed URL in production

// ── Shared fetch helper ──────────────────────────────────────────────────────
async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── Collect the agency form into an object ───────────────────────────────────
function collectFormData() {
  // Gather checked checklist items
  const checklist = [];
  document.querySelectorAll('#agencyChecklist input[type=checkbox]:checked').forEach(cb => {
    checklist.push(cb.closest('label').querySelector('span').textContent.trim());
  });

  return {
    petName:         document.getElementById('r-petName').value.trim(),
    petBreed:        document.getElementById('r-petBreed').value.trim(),
    ownerName:       document.getElementById('r-ownerName').value.trim(),
    ownerEmail:      document.getElementById('r-ownerEmail').value.trim(),
    agencyName:      document.getElementById('r-agencyName').value.trim(),
    agencyEmail:     document.getElementById('r-agencyEmail').value.trim(),
    feedingSchedule: document.getElementById('r-feeding').value.trim(),
    medications:     document.getElementById('r-meds').value.trim(),
    vetContact:      document.getElementById('r-vet').value.trim(),
    notes:           document.getElementById('r-notes').value.trim(),
    checklist,
  };
}

// ── Stores the current sitter token after the agency sends the form ──────────
let currentSitterToken = null;

// ════════════════════════════════════════════════════════════════════════════
// BUTTON: "Send Care Form to Owner"
// Replaces the old sendToOwner() function
// ════════════════════════════════════════════════════════════════════════════
async function sendToOwner() {
  const formData = collectFormData();
  if (!formData.petName || !formData.ownerEmail || !formData.ownerName || !formData.agencyEmail) {
    showToast('Please fill in Pet Name, Owner Name, Owner Email, and Agency Email.', 'info');
    return;
  }

  const btn = document.querySelector('.btn-send');
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;

  try {
    const result = await apiPost('/api/send-care-form', formData);
    currentSitterToken = result.token;

    // Show the sitter link automatically
    showSitterLink(result.sitterLink);
    showToast(`📧 Care form sent to ${formData.ownerEmail}!`, 'success', 5000);
    showToast(`${formData.ownerName} will receive a link they can forward to their sitter.`, 'info', 6500);
    btn.textContent = '✅ Sent!';
  } catch (err) {
    showToast(`❌ ${err.message}`, 'info');
    btn.textContent = 'Send Care Form to Owner';
    btn.disabled = false;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// BUTTON: "Generate Shareable Link" 
// Replaces the old generateSitterLink() function
// ════════════════════════════════════════════════════════════════════════════
async function generateSitterLink() {
  // If we already have a token from a previous send, just show the link
  if (currentSitterToken) {
    const link = `${window.location.origin}/sitter?token=${currentSitterToken}`;
    showSitterLink(link);
    showToast('🔗 Sitter link ready — click the field to copy!', 'success');
    return;
  }

  // Otherwise send the form first to generate a token
  const formData = collectFormData();
  if (!formData.petName || !formData.ownerEmail || !formData.agencyEmail) {
    showToast('Fill in Pet Name, Owner Email, and Agency Email first.', 'info');
    return;
  }

  try {
    const result = await apiPost('/api/send-care-form', formData);
    currentSitterToken = result.token;
    showSitterLink(result.sitterLink);
    showToast(`🔗 Sitter link generated for ${formData.petName}!`, 'success');
  } catch (err) {
    showToast(`❌ ${err.message}`, 'info');
  }
}

// ── Helper: show the sitter link input box ───────────────────────────────────
function showSitterLink(url) {
  const box   = document.getElementById('sitterLinkBox');
  const input = document.getElementById('sitterLinkInput');
  input.value = url;
  box.style.display = 'block';
  input.select();
}

// ════════════════════════════════════════════════════════════════════════════
// SITTER PAGE — Load session data from backend when page opens via ?token=
// Call this from your sitter page initialization logic
// ════════════════════════════════════════════════════════════════════════════
async function loadSitterSession(token) {
  try {
    const res = await fetch(`${API_BASE}/api/sitter-session/${token}`);
    if (!res.ok) throw new Error('Session not found or expired.');
    const session = await res.json();

    // Populate the sitter page with the loaded data
    document.getElementById('sitterPetName').textContent   = session.petName   || 'your pet';
    document.getElementById('completionPetName').textContent = session.petName || 'your pet';

    // Optionally pre-fill a care summary if you have those elements
    if (document.getElementById('s-feeding'))
      document.getElementById('s-feeding').textContent = session.feedingSchedule || '—';
    if (document.getElementById('s-meds'))
      document.getElementById('s-meds').textContent = session.medications || '—';
    if (document.getElementById('s-vet'))
      document.getElementById('s-vet').textContent = session.vetContact || '—';

    return session;
  } catch (err) {
    showToast(`⚠️ ${err.message}`, 'info');
    return null;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// SITTER PAGE — "Submit & Notify Owner + Agency"
// Replaces the old submitSitterForm() function
// ════════════════════════════════════════════════════════════════════════════
async function submitSitterForm() {
  const params   = new URLSearchParams(window.location.search);
  const token    = params.get('token');
  const name     = document.getElementById('s-name').value.trim();
  const email    = document.getElementById('s-email').value.trim();
  const notes    = document.getElementById('s-notes').value.trim();

  if (!name || !email) { showToast('Please enter your name and email.', 'info'); return; }
  if (!token)          { showToast('Missing session token. Use the link from your owner.', 'info'); return; }

  // Gather checked tasks
  const completedTasks = [];
  document.querySelectorAll('#sitterChecklist input[type=checkbox]:checked').forEach(cb => {
    completedTasks.push(cb.closest('label').querySelector('span').textContent.replace(' ✓','').trim());
  });
  if (completedTasks.length === 0) { showToast('Please check off at least one completed task.', 'info'); return; }

  const btn = document.querySelector('.btn-complete');
  btn.textContent = '⏳ Submitting...';
  btn.disabled = true;

  try {
    await apiPost('/api/complete-care', {
      token,
      sitterName:     name,
      sitterEmail:    email,
      completedTasks,
      sitterNotes:    notes,
    });

    // Show completion banner + confetti
    document.getElementById('sitterFormWrap').style.display = 'none';
    document.getElementById('completionBanner').classList.add('show');
    launchConfetti();
    showToast('✅ Owner notified — care form completion confirmed!', 'success', 6000);
    setTimeout(() => showToast('🏥 Adoption agency notified — checklist complete!', 'success', 6000), 1200);

  } catch (err) {
    showToast(`❌ ${err.message}`, 'info');
    btn.textContent = '✅ Submit & Notify Owner + Agency';
    btn.disabled = false;
  }
}

// ── Auto-load sitter session when the page has ?token= in the URL ────────────
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const token  = params.get('token');
  if (params.get('sitter') === '1' || token) {
    openSitterPage(); // show the sitter page section
    if (token) loadSitterSession(token);
  }
});