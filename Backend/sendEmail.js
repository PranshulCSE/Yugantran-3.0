import { getGmailClient } from "./gmailClient.js";

export async function sendConfirmationEmail(to, payload) {
  const gmail = await getGmailClient();

  const subject = `Registration Confirmed: ${payload.event} - YUGANTRAN 2.0 2025`;

  const html = `
  <div
    style="
      font-family: Arial, sans-serif;
      background: #f4f7fb;
      padding: 40px 0;
      text-align: center;
      color: #333;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: auto;
        background: white;
        border-radius: 12px;
        padding: 40px 35px 50px;
        box-shadow: 0 4px 25px rgba(0,0,0,0.1);
      "
    >

      <!-- HEADER -->
      <h2
        style="
          color: #005eff;
          margin-bottom: 15px;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 1px;
        "
      >
        Registration Confirmed 🎉
      </h2>

      <p
        style="
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 30px;
          font-weight: 600;
          color: #222;
        "
      >
        Welcome to <strong>YUGANTRAN 2.0</strong> — Tech Fest at <br />
        <strong>Geeta University</strong>
      </p>

      <!-- MAIN CONTENT -->
      <p style="font-size: 16px; line-height: 1.6;">
        Hello <strong>${payload.name}</strong>,
      </p>

      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
        Thank you for registering for the
        <strong>${payload.event}</strong> at
        <strong>YUGANTRAN 2.0 (2025)</strong>.
        We are thrilled to have your participation in this exciting event!
      </p>

      <!-- EVENT DETAILS -->
      <div
        style="
          background: #e8f0fe;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          text-align: left;
          font-size: 16px;
          color: #005eff;
          box-shadow: inset 0 0 5px #cde1ff;
        "
      >
        <p style="margin: 8px 0;">
          <strong>📅 Date:</strong> 28th November 2025
        </p>
        <p style="margin: 8px 0;">
          <strong>📍 Venue:</strong> Geeta University, Panipat-Delhi NCR, Haryana, India.
        </p>
        <p style="margin: 8px 0;">
          <strong>⏰ Time:</strong> 9:00 AM - 4:00 PM
        </p>
      </div>

      <!-- WHATSAPP CTA -->
      ${
        payload.whatsappLink
          ? `
      <div style="margin-bottom: 35px;">
        <a
          href="${payload.whatsappLink}"
          style="
            background: #25d366;
            color: white;
            padding: 14px 30px;
            border-radius: 6px;
            text-decoration: none;
            font-size: 16px;
            font-weight: 700;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
            transition: background 0.3s ease;
          "
          onmouseover="this.style.background='#1ebe57'"
          onmouseout="this.style.background='#25d366'"
        >
          Join WhatsApp Group
        </a>
      </div>
      `
          : ""
      }

      <!-- CONTACT INFO -->
      <div
        style="
          text-align: left;
          font-size: 15px;
          color: #555;
          margin-bottom: 25px;
        "
      >
        <p style="margin: 5px 0; font-weight: 600;">Need Help?</p>
        <p style="margin: 3px 0;">
          Email: <a href="mailto:yugantran@geetauniversity.edu.in" style="color:#005eff; text-decoration:none;">yugantran@geetauniversity.edu.in</a>
        </p>
        <p style="margin: 3px 0;">
          Phone: <a href="tel:+919211067540" style="color:#005eff; text-decoration:none;">+91 92110 67540</a>, <a href="tel:+919053709750" style="color:#005eff; text-decoration:none;">+91 90537 09750</a>
        </p>
      </div>

      <!-- SOCIAL LINKS -->
      <div style="margin-bottom: 40px;">
        <a href="https://www.instagram.com/geetauniversitypanipat/" target="_blank" style="margin: 0 8px;">
          <img src="https://cdn-icons-png.flaticon.com/24/2111/2111463.png" alt="Instagram" width="24" style="vertical-align: middle;" />
        </a>
        <a href="https://www.linkedin.com/school/geeta-university-official/posts/?feedView=all" target="_blank" style="margin: 0 8px;">
          <img src="https://cdn-icons-png.flaticon.com/24/174/174857.png" alt="LinkedIn" width="24" style="vertical-align: middle;" />
        </a>
      </div>

      <!-- FOOTER -->
      <p
        style="
          color: #777;
          font-size: 13px;
          line-height: 1.5;
          margin-top: 0;
          margin-bottom: 0;
          text-align: left;
        "
      >
        Geeta University, Panipat-Delhi NCR, Haryana, India<br />
        Phone: +91 92110 67540 | Email: yugantran@geetauniversity.edu.in
      </p>
    </div>

    <!-- SMALL FOOTER -->
    <p style="margin-top: 20px; color: #999; font-size: 12px; text-align: center;">
      © 2025 YUGANTRAN 2.0 • Geeta University | 
      <a href="#" style="color:#999; text-decoration: underline;">Unsubscribe</a>
    </p>
  </div>
`;



  const messageParts = [
    `From: "YUGANTRAN 2.0" <${process.env.GMAIL_SENDER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    html,
  ];

  const encodedMessage = Buffer.from(messageParts.join("\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });

  console.log(`📧 Sent: ${to}`);
}
