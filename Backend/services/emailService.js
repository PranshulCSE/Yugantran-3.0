import { Resend } from "resend";
import nodemailer from "nodemailer";

let resendClient = null;
function getResendClient() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

let nodemailerTransporter = null;
function getNodemailerTransporter() {
  if (nodemailerTransporter) return nodemailerTransporter;

  if (process.env.GMAIL_USER && (process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS)) {
    nodemailerTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS,
      },
    });
    return nodemailerTransporter;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    nodemailerTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return nodemailerTransporter;
  }

  return null;
}

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
                            📞 Helpline: <a href="tel:+919211067540" style="color:#00f0ff;text-decoration:none;font-weight:600;">+91 92110 67540</a> &nbsp;|&nbsp; <a href="tel:+919053709750" style="color:#00f0ff;text-decoration:none;font-weight:600;">+91 90537 09750</a>
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

  // 1. Try Nodemailer / Gmail SMTP first if configured
  const transporter = getNodemailerTransporter();
  if (transporter) {
    try {
      const fromAddress = process.env.EMAIL_FROM || process.env.GMAIL_USER || "YUGANTRAN 3.0 <yugantran@geetauniversity.edu.in>";
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html,
      });
      console.log(`📧 [SMTP/Gmail] Email sent to ${to} | ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (smtpErr) {
      console.error("❌ SMTP/Gmail Email Failed:", smtpErr.message);
    }
  }

  // 2. Try Resend if configured
  const resend = getResendClient();
  if (resend) {
    try {
      let fromAddress = process.env.EMAIL_FROM || "YUGANTRAN 3.0 <onboarding@resend.dev>";
      
      // Resend does not permit @gmail.com as the sender domain without domain verification
      if (/@gmail\.com|@yahoo\.com|@hotmail\.com/i.test(fromAddress)) {
        console.warn(`⚠️ Warning: Resend does not allow sending from public domains like ${fromAddress}. Using 'onboarding@resend.dev'.`);
        fromAddress = "YUGANTRAN 3.0 <onboarding@resend.dev>";
      }

      const result = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        html,
      });

      if (result.error) {
        console.error("❌ Resend Email Failed:", result.error.message || result.error);
        return { success: false, error: result.error.message };
      }

      console.log(`📧 [Resend] Email sent to ${to} | ID: ${result.data?.id}`);
      return { success: true, messageId: result.data?.id };
    } catch (error) {
      console.error("❌ Resend Email Error:", error.message);
      return { success: false, error: error.message };
    }
  }

  console.warn("⚠️ No working email provider configured. Please set GMAIL_USER + GMAIL_APP_PASSWORD or RESEND_API_KEY in .env.");
  return { success: false, error: "No email provider configured" };
}
