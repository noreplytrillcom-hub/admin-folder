/**
 * Email Audit Logs Service
 * Manages email dispatch records, delivery statuses, open tracking, and bounces.
 */

const STORAGE_KEY = "testo_admin_email_logs";

const INITIAL_EMAIL_LOGS = [
  {
    id: "EML-LOG-9001",
    resend_id: "cbb8d1da-61db-46b5-a968-31e1b9841143",
    recipient_email: "sarah.j@acmecloud.io",
    partner_name: "Acme Cloud Solutions",
    contact_person: "Sarah Jenkins",
    email_code: "EML-89410",
    subject: "Welcome to Testo! Partner Verification Code: EML-89410",
    status: "Delivered",
    open_count: 3,
    last_opened_at: new Date(Date.now() - 12 * 60000).toISOString(),
    provider: "Resend API",
    sent_at: new Date(Date.now() - 35 * 60000).toISOString(),
    delivery_details: "Delivered to sarah.j@acmecloud.io inbox via Resend. Message ID: cbb8d1da-61db-46b5-a968-31e1b9841143",
  },
  {
    id: "EML-LOG-9002",
    resend_id: "1faf266c-949f-4c0e-be10-745384e4ab26",
    recipient_email: "e.vance@apexcognitive.ai",
    partner_name: "Apex Cognitive Systems",
    contact_person: "Dr. Elena Vance",
    email_code: "EML-55219",
    subject: "Welcome to Testo! Partner Verification Code: EML-55219",
    status: "Opened",
    open_count: 1,
    last_opened_at: new Date(Date.now() - 5 * 60000).toISOString(),
    provider: "Resend API",
    sent_at: new Date(Date.now() - 15 * 60000).toISOString(),
    delivery_details: "Opened on macOS Mail / Safari user agent.",
  },
  {
    id: "EML-LOG-9003",
    resend_id: "a892b1c4-90e1-4b12-b901-112233445566",
    recipient_email: "m.brody@nexuscyber.com",
    partner_name: "Nexus Cybernetics",
    contact_person: "Marcus Brody",
    email_code: "EML-77104",
    subject: "Welcome to Testo! Partner Verification Code: EML-77104",
    status: "Delivered",
    open_count: 2,
    last_opened_at: new Date(Date.now() - 40 * 60000).toISOString(),
    provider: "Resend API",
    sent_at: new Date(Date.now() - 120 * 60000).toISOString(),
    delivery_details: "Dispatched via Resend API. Message ID: a892b1c4-90e1-4b12-b901-112233445566",
  },
  {
    id: "EML-LOG-9004",
    resend_id: "f7710294-8841-4c12-a102-998877665544",
    recipient_email: "rachel@vortexlabs.dev",
    partner_name: "Vortex Data Labs",
    contact_person: "Rachel Qi",
    email_code: "EML-30912",
    subject: "Welcome to Testo! Partner Verification Code: EML-30912",
    status: "Delivered",
    open_count: 1,
    last_opened_at: new Date(Date.now() - 90 * 60000).toISOString(),
    provider: "Resend API",
    sent_at: new Date(Date.now() - 180 * 60000).toISOString(),
    delivery_details: "Delivered to rachel@vortexlabs.dev via Resend.",
  },
  {
    id: "EML-LOG-9005",
    resend_id: "b9910248-1129-4c88-b991-009988776655",
    recipient_email: "liam@synapse.ie",
    partner_name: "Synapse Dynamics",
    contact_person: "Liam O'Connor",
    email_code: "EML-94815",
    subject: "Welcome to Testo! Partner Verification Code: EML-94815",
    status: "Opened",
    open_count: 4,
    last_opened_at: new Date(Date.now() - 10 * 60000).toISOString(),
    provider: "Resend API",
    sent_at: new Date(Date.now() - 240 * 60000).toISOString(),
    delivery_details: "Delivered to liam@synapse.ie. Opened 4 times.",
  },
];

export function getEmailLogs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error("Error reading stored email logs:", err);
  }
  // Default to initial logs
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMAIL_LOGS));
  return INITIAL_EMAIL_LOGS;
}

export function recordEmailLog(logEntry) {
  try {
    const existing = getEmailLogs();
    const newRecord = {
      id: `EML-LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      resend_id: logEntry.resend_id || `resend_${Math.random().toString(36).substring(2, 10)}`,
      recipient_email: logEntry.recipient_email,
      partner_name: logEntry.partner_name,
      contact_person: logEntry.contact_person,
      email_code: logEntry.email_code,
      subject: logEntry.subject || `Welcome to Testo! Partner Verification Code: ${logEntry.email_code}`,
      status: logEntry.status || "Delivered",
      open_count: logEntry.open_count || 0,
      last_opened_at: null,
      provider: logEntry.provider || "Resend API",
      sent_at: new Date().toISOString(),
      delivery_details: logEntry.delivery_details || "Dispatched via Resend API.",
    };

    const updated = [newRecord, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (err) {
    console.error("Failed to record email log:", err);
    return null;
  }
}
