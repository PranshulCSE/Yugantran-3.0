import { Resend } from "resend";

let resendClient = null;
function getResendClient() {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export async function sendConfirmationEmail(to, payload) {
  const { name, event, teamName, transactionId, whatsappLink } = payload;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registration Confirmed</title>
  </head>
  <body style="margin:0;padding:0;background:#000a00;font-family:'Courier New',monospace;">
    <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

      <!-- Header -->
      <div style="text-align:center;border:1px solid #00ff41;border-radius:8px;padding:30px;background:rgba(0,255,65,0.04);margin-bottom:24px;">
        <div style="color:#00ff41;font-size:12px;letter-spacing:4px;margin-bottom:8px;">YUGANTRAN 3.0</div>
        <h1 style="color:#00ff41;font-size:28px;margin:0;letter-spacing:2px;text-shadow:0 0 20px rgba(0,255,65,0.5);">
          REGISTRATION CONFIRMED ✓
        </h1>
        <div style="color:#00cc33;font-size:12px;margin-top:8px;letter-spacing:2px;">
          Innovate. Build. Compete. Transform.
        </div>
      </div>

      <!-- Main Content -->
      <div style="border:1px solid rgba(0,255,65,0.2);border-radius:8px;padding:28px;background:rgba(0,255,65,0.02);margin-bottom:24px;">
        <p style="color:#b0ffb0;font-size:16px;margin:0 0 16px;">
          Hello <strong style="color:#00ff41;">${name}</strong>,
        </p>
        <p style="color:#b0ffb0;font-size:15px;line-height:1.7;margin:0 0 24px;">
          Your registration for <strong style="color:#00ff41;">${event}</strong> at
          <strong style="color:#00ff41;">YUGANTRAN 3.0</strong> has been received.
          ${teamName ? `Your team <strong style="color:#00ff41;">${teamName}</strong> is registered.` : ""}
        </p>

        <!-- Event Details Box -->
        <div style="background:#000f00;border:1px solid rgba(0,255,65,0.3);border-radius:6px;padding:20px;margin-bottom:24px;">
          <div style="color:#00ff41;font-size:11px;letter-spacing:3px;margin-bottom:16px;">[ EVENT DETAILS ]</div>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="color:#666;font-size:13px;padding:6px 0;width:40%;">📅 Date</td>
              <td style="color:#b0ffb0;font-size:13px;padding:6px 0;">27–28 October 2026</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:13px;padding:6px 0;">📍 Venue</td>
              <td style="color:#b0ffb0;font-size:13px;padding:6px 0;">Geeta University, Panipat, Haryana</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:13px;padding:6px 0;">⏰ Time</td>
              <td style="color:#b0ffb0;font-size:13px;padding:6px 0;">9:00 AM – 5:00 PM</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:13px;padding:6px 0;">🎯 Event</td>
              <td style="color:#00ff41;font-size:13px;padding:6px 0;">${event}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:13px;padding:6px 0;">🔖 Txn ID</td>
              <td style="color:#b0ffb0;font-size:13px;padding:6px 0;">${transactionId}</td>
            </tr>
          </table>
        </div>

        <!-- WhatsApp CTA -->
        ${whatsappLink && whatsappLink !== "#" ? `
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${whatsappLink}"
            style="display:inline-block;background:#25d366;color:white;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:1px;">
            📱 Join WhatsApp Group
          </a>
        </div>
        ` : ""}

        <!-- Important Note -->
        <div style="background:rgba(0,255,65,0.06);border-left:3px solid #00ff41;border-radius:4px;padding:14px 18px;">
          <p style="color:#00ff41;font-size:12px;letter-spacing:2px;margin:0 0 6px;">[ IMPORTANT ]</p>
          <p style="color:#b0ffb0;font-size:13px;margin:0;line-height:1.6;">
            Please carry a valid college ID card on the day of the event. 
            Your payment receipt has been received and is under review.
            Registration status will be confirmed via email.
          </p>
        </div>
      </div>

      <!-- Contact -->
      <div style="border:1px solid rgba(0,255,65,0.1);border-radius:8px;padding:20px;margin-bottom:24px;">
        <div style="color:#00ff41;font-size:11px;letter-spacing:3px;margin-bottom:12px;">[ NEED HELP? ]</div>
        <p style="color:#b0ffb0;font-size:13px;margin:4px 0;">
          📧 <a href="mailto:yugantran@geetauniversity.edu.in" style="color:#00ff41;text-decoration:none;">yugantran@geetauniversity.edu.in</a>
        </p>
        <p style="color:#b0ffb0;font-size:13px;margin:4px 0;">
          📞 <a href="tel:+919211067540" style="color:#00ff41;text-decoration:none;">+91 92110 67540</a>
          &nbsp;|&nbsp;
          <a href="tel:+919053709750" style="color:#00ff41;text-decoration:none;">+91 90537 09750</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align:center;">
        <p style="color:#333;font-size:11px;letter-spacing:1px;margin:0;">
          © 2026 YUGANTRAN 3.0 • School of Computer Science & Engineering<br/>
          Geeta University, Panipat-Delhi NCR, Haryana, India
        </p>
      </div>

    </div>
  </body>
  </html>
  `;

  try {
    const resend = getResendClient();
    if (!resend) {
      console.warn("⚠️ RESEND_API_KEY is not configured. Email notification skipped.");
      return null;
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "YUGANTRAN 3.0 <onboarding@resend.dev>",
      to: [to],
      subject: `✓ Registration Confirmed: ${event} — YUGANTRAN 3.0`,
      html,
    });
    console.log(`📧 Email sent to ${to} | ID: ${result.data?.id}`);
    return result;
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    // Don't throw — email failure shouldn't break registration
  }
}
