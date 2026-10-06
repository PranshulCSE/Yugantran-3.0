import nodemailer from "nodemailer";
import dns from "dns";

// Ensure Node.js prioritizes IPv4 over IPv6 for DNS queries.
// This prevents connection timeouts / ENETUNREACH errors on cloud hosting (Render, Docker, etc.).
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

let cachedTransporter = null;

/**
 * Returns a configured Nodemailer Gmail transporter.
 */
function getGmailTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const gmailUser = (process.env.GMAIL_USER || "").trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || "").replace(/\s+/g, "");

  if (!gmailUser || !gmailPass) {
    return null;
  }

  // Primary: standard Gmail service transport with connection pooling
  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: false,
    },
  });

  return cachedTransporter;
}

/**
 * Direct fallback transporter using explicit host & port with family: 4.
 */
function getDirectSmtpTransporter(port = 465, secure = true) {
  const gmailUser = (process.env.GMAIL_USER || "").trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || "").replace(/\s+/g, "");

  if (!gmailUser || !gmailPass) return null;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port,
    secure,
    family: 4,
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Custom SMTP transporter if SMTP_HOST is explicitly configured.
 */
let customSmtpTransporter = null;
function getCustomSmtpTransporter() {
  if (customSmtpTransporter) return customSmtpTransporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    customSmtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST.trim(),
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      family: 4,
      auth: {
        user: process.env.SMTP_USER.trim(),
        pass: process.env.SMTP_PASS.trim(),
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      tls: {
        rejectUnauthorized: false,
      },
    });
    return customSmtpTransporter;
  }

  return null;
}

/**
 * Sends registration confirmation email using Gmail SMTP.
 *
 * @param {string} to - Recipient email address
 * @param {object} payload - Registration details (name, event, teamName, transactionId, whatsappLink)
 * @returns {Promise<{ success: boolean, provider?: string, messageId?: string, sender?: string, error?: string }>}
 */
export async function sendConfirmationEmail(to, payload) {
  const { name, event, teamName, transactionId, whatsappLink } = payload;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registration Confirmed - YUGANTRAN 3.0</title>
  </head>
  <body style="margin:0;padding:0;background-color:#070a12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#070a12;padding:30px 10px;">
      <tr>
        <td align="center">
          
          <!-- Outer Container -->
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background:#0d1322;border:1px solid #1e293b;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.6);">
            
            <!-- Top Cyber Glow Header -->
            <tr>
              <td style="background:linear-gradient(135deg, #051329 0%, #0a2540 50%, #051329 100%);padding:32px 28px 24px;text-align:center;border-bottom:1px solid #1e3a5f;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <div style="display:inline-block;padding:4px 14px;border-radius:20px;background:rgba(0,240,255,0.1);border:1px solid rgba(0,240,255,0.3);color:#00f0ff;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">
                        ⚡ GEETA UNIVERSITY • TECH FEST 2026
                      </div>
                      <h1 style="color:#ffffff;font-size:26px;font-weight:800;margin:0 0 6px;letter-spacing:1px;">
                        YUGANTRAN <span style="color:#00f0ff;">3.0</span>
                      </h1>
                      <p style="color:#94a3b8;font-size:13px;margin:0;letter-spacing:0.5px;">
                        Innovate • Build • Compete • Transform
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Status Banner -->
            <tr>
              <td style="padding:20px 28px 0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:linear-gradient(90deg, rgba(16,185,129,0.12) 0%, rgba(0,240,255,0.08) 100%);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:16px 20px;">
                  <tr>
                    <td width="36" valign="middle">
                      <div style="width:32px;height:32px;line-height:32px;border-radius:50%;background:#10b981;color:#ffffff;text-align:center;font-size:18px;font-weight:bold;">
                        ✓
                      </div>
                    </td>
                    <td style="padding-left:14px;" valign="middle">
                      <div style="color:#10b981;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">Status Verified</div>
                      <div style="color:#ffffff;font-size:16px;font-weight:700;margin-top:2px;">Registration Confirmed</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main Content Area -->
            <tr>
              <td style="padding:24px 28px;">
                <p style="color:#f1f5f9;font-size:16px;margin:0 0 12px;font-weight:600;">
                  Hello <span style="color:#00f0ff;">${name}</span>,
                </p>
                <p style="color:#cbd5e1;font-size:14px;line-height:1.6;margin:0 0 24px;">
                  We are thrilled to confirm your registration for <strong style="color:#ffffff;">${event}</strong> at <strong>YUGANTRAN 3.0</strong>! Your participant pass has been officially generated.
                  ${teamName ? `<br/><span style="display:inline-block;margin-top:6px;color:#38bdf8;">👥 Team Name: <strong>${teamName}</strong></span>` : ""}
                </p>

                <!-- Pass / Event Details Card -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#131d31;border:1px solid #22324e;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                  <tr>
                    <td style="padding:14px 20px;background:#18253d;border-bottom:1px solid #22324e;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="color:#00f0ff;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">
                            🎟️ PARTICIPANT PASS & EVENT INTEL
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 20px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        
                        <!-- Event Row -->
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;width:35%;border-bottom:1px solid #1a2740;">🎯 Target Event</td>
                          <td style="padding:8px 0;color:#ffffff;font-size:14px;font-weight:700;border-bottom:1px solid #1a2740;">${event}</td>
                        </tr>

                        <!-- Date Row -->
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;border-bottom:1px solid #1a2740;">📅 Date</td>
                          <td style="padding:8px 0;color:#e2e8f0;font-size:13px;font-weight:600;border-bottom:1px solid #1a2740;">27–28 October 2026</td>
                        </tr>

                        <!-- Time Row -->
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;border-bottom:1px solid #1a2740;">⏰ Reporting Time</td>
                          <td style="padding:8px 0;color:#e2e8f0;font-size:13px;font-weight:600;border-bottom:1px solid #1a2740;">9:00 AM IST onwards</td>
                        </tr>

                        <!-- Venue Row -->
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;border-bottom:1px solid #1a2740;">📍 Venue</td>
                          <td style="padding:8px 0;color:#e2e8f0;font-size:13px;font-weight:600;border-bottom:1px solid #1a2740;">Geeta University Campus, Panipat, Haryana</td>
                        </tr>

                        <!-- Transaction ID Row -->
                        <tr>
                          <td style="padding:8px 0;color:#94a3b8;font-size:13px;">🔖 Reference ID</td>
                          <td style="padding:8px 0;color:#00f0ff;font-size:13px;font-family:'Courier New',monospace;font-weight:700;">${transactionId}</td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>

                <!-- WhatsApp CTA Button -->
                ${whatsappLink && whatsappLink !== "#" ? `
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                  <tr>
                    <td align="center">
                      <a href="${whatsappLink}" target="_blank" style="display:inline-block;background:linear-gradient(135deg, #25D366 0%, #128C7E 100%);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:10px;box-shadow:0 8px 20px rgba(37,211,102,0.3);letter-spacing:0.5px;">
                        💬 Join Official Event WhatsApp Group
                      </a>
                      <div style="color:#64748b;font-size:11px;margin-top:8px;">
                        Connect with coordinators, mentors & fellow participants
                      </div>
                    </td>
                  </tr>
                </table>
                ` : ""}

                <!-- Important Guidelines -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:rgba(255,255,255,0.02);border-left:4px solid #00f0ff;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:24px;">
                  <tr>
                    <td>
                      <div style="color:#00f0ff;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">
                        ⚠️ Important Instructions
                      </div>
                      <ul style="margin:0;padding-left:18px;color:#cbd5e1;font-size:13px;line-height:1.6;">
                        <li>Carry your <strong>original College/University ID card</strong> for physical entry.</li>
                        <li>Bring your laptops, chargers, and essential accessories for technical rounds.</li>
                        <li>Your payment transaction is stored securely for automated on-desk verification.</li>
                      </ul>
                    </td>
                  </tr>
                </table>

                <!-- Help & Support -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#111a2e;border:1px solid #1e293b;border-radius:10px;padding:16px 20px;">
                  <tr>
                    <td>
                      <div style="color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">
                        💬 Need Assistance?
                      </div>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="color:#cbd5e1;font-size:13px;padding:3px 0;">
                            📧 Email: <a href="mailto:yugantran@geetauniversity.edu.in" style="color:#00f0ff;text-decoration:none;font-weight:600;">yugantran@geetauniversity.edu.in</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="color:#cbd5e1;font-size:13px;padding:3px 0;">
                            📞 Helpline: <a href="tel:+919999238013" style="color:#00f0ff;text-decoration:none;font-weight:600;">+91 99992 38013</a> &nbsp;|&nbsp; <a href="tel:+919992560407" style="color:#00f0ff;text-decoration:none;font-weight:600;">+91 99925 60407</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#070b14;padding:24px 28px;text-align:center;border-top:1px solid #172338;">
                <p style="color:#94a3b8;font-size:12px;margin:0 0 6px;font-weight:600;">
                  School of Computer Science & Engineering • Geeta University
                </p>
                <p style="color:#64748b;font-size:11px;margin:0;line-height:1.5;">
                  NH-71, G.T. Road, Naultha, Panipat-Delhi NCR, Haryana 132145<br/>
                  © 2026 YUGANTRAN 3.0. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
          <!-- End Outer Container -->

        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const subject = `✓ Registration Confirmed: ${event} — YUGANTRAN 3.0`;

  // 1. Try Google Apps Script Webhook (Bypasses Render SMTP port blocks)
  const webhookUrl = process.env.GOOGLE_EMAIL_WEBHOOK_URL;
  if (webhookUrl && webhookUrl.startsWith("http")) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const params = new URLSearchParams();
      params.append('to', to);
      params.append('subject', subject);
      params.append('htmlBody', html);
      
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
        redirect: "follow",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      
      if (data && data.success) {
        console.log(`📧 [Google Webhook] Confirmation email sent successfully to ${to}`);
        return { success: true, provider: "google-webhook" };
      } else {
        console.warn(`⚠️ [Google Webhook] Script returned error: ${data?.error}. Falling back...`);
      }
    } catch (webhookErr) {
      console.warn(`⚠️ [Google Webhook] Request failed (${webhookErr.message}). Falling back...`);
    }
  }

  // 2. Try Nodemailer / Gmail SMTP first if configured
  const gmailUser = (process.env.GMAIL_USER || "").trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || "").replace(/\s+/g, "");

  if (gmailUser && gmailPass) {
    const senderName = process.env.EMAIL_SENDER_NAME || "YUGANTRAN 3.0";
    const fromAddress = `"${senderName}" <${gmailUser}>`;

    // Attempt 1: Standard Gmail Transport
    try {
      const transporter = getGmailTransporter();
      if (transporter) {
        const info = await transporter.sendMail({
          from: fromAddress,
          to,
          subject,
          html,
        });
        console.log(`📧 [Gmail Service] Confirmation email sent successfully to ${to} from ${gmailUser} | ID: ${info.messageId}`);
        return { success: true, provider: "gmail", messageId: info.messageId, sender: fromAddress };
      }
    } catch (primaryErr) {
      console.warn(`⚠️ [Gmail Service] Primary transport failed (${primaryErr.message}). Retrying with direct Port 465...`);
      
      // Attempt 2: Direct SSL Port 465
      try {
        const direct465 = getDirectSmtpTransporter(465, true);
        if (direct465) {
          const info465 = await direct465.sendMail({
            from: fromAddress,
            to,
            subject,
            html,
          });
          console.log(`📧 [Gmail Direct 465] Confirmation email sent to ${to} | ID: ${info465.messageId}`);
          return { success: true, provider: "gmail", messageId: info465.messageId, sender: fromAddress };
        }
      } catch (port465Err) {
        console.warn(`⚠️ [Gmail Direct 465] Failed (${port465Err.message}). Retrying with Port 587...`);
        
        // Attempt 3: Direct TLS Port 587
        try {
          const direct587 = getDirectSmtpTransporter(587, false);
          if (direct587) {
            const info587 = await direct587.sendMail({
              from: fromAddress,
              to,
              subject,
              html,
            });
            console.log(`📧 [Gmail Direct 587] Confirmation email sent to ${to} | ID: ${info587.messageId}`);
            return { success: true, provider: "gmail", messageId: info587.messageId, sender: fromAddress };
          }
        } catch (port587Err) {
          console.error("❌ [Gmail SMTP] All Gmail SMTP attempts failed:", port587Err.message);
          return { success: false, provider: "gmail", error: port587Err.message };
        }
      }
    }
  }

  // Fallback to custom SMTP host if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const transporter = getCustomSmtpTransporter();
    if (transporter) {
      try {
        const fromAddress = process.env.EMAIL_FROM || `"YUGANTRAN 3.0" <${process.env.SMTP_USER}>`;
        const info = await transporter.sendMail({
          from: fromAddress,
          to,
          subject,
          html,
        });
        console.log(`📧 [Custom SMTP] Email sent successfully to ${to} | ID: ${info.messageId}`);
        return { success: true, provider: "smtp", messageId: info.messageId, sender: fromAddress };
      } catch (smtpErr) {
        console.error("❌ [Custom SMTP] Failed to send:", smtpErr.message);
        return { success: false, provider: "smtp", error: smtpErr.message };
      }
    }
  }

  console.warn("⚠️ No Gmail credentials configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env.");
  return { success: false, error: "No Gmail credentials configured (GMAIL_USER & GMAIL_APP_PASSWORD)" };
}
