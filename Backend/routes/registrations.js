import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadToDrive } from "../services/driveService.js";
import { sendConfirmationEmail } from "../services/emailService.js";
import { appendConfirmedRegistrationToSheet } from "../services/sheetsService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");

const router = express.Router();

// ─── PUBLIC ─────────────────────────────────────────

// GET /api/registrations/receipt/:id — Stream receipt image directly from DB/disk
router.get("/receipt/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let reg = null;

    if (id && id !== "temp") {
      try {
        reg = await Registration.findById(id);
      } catch (findErr) {
        console.warn("⚠️ Invalid ID format in receipt lookup:", id);
      }
    }

    if (!reg) return res.status(404).json({ error: "Registration receipt not found." });

    // 1. If stored in DB as base64
    if (reg.paymentReceiptData) {
      let base64 = reg.paymentReceiptData;
      if (base64.includes(",")) {
        base64 = base64.split(",")[1];
      }
      const buffer = Buffer.from(base64, "base64");
      const mime = reg.paymentReceiptMimeType || "image/jpeg";
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(buffer);
    }

    // 2. If drive link exists (and not local stream link)
    if (
      reg.paymentReceiptUrl &&
      reg.paymentReceiptUrl.startsWith("http") &&
      !reg.paymentReceiptUrl.includes("/api/registrations/receipt/") &&
      !reg.paymentReceiptUrl.includes("/uploads/")
    ) {
      return res.redirect(reg.paymentReceiptUrl);
    }

    // 3. Check local uploads dir
    if (reg.paymentReceiptUrl) {
      const filename = path.basename(reg.paymentReceiptUrl);
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    }

    res.status(404).json({ error: "Receipt image not available." });
  } catch (err) {
    console.error("Receipt load error:", err.message);
    res.status(500).json({ error: "Failed to load receipt image." });
  }
});

// POST /api/register — Submit registration
router.post("/", upload.single("paymentReceipt"), async (req, res) => {
  try {
    const {
      name, rollNumber, program, semester, mobileNumber,
      college, email, eventId, eventName, teamType, teamName,
      teamMembers, upiId, transactionId, whatsappLink,
    } = req.body;

    // Basic validation
    if (!name || !rollNumber || !program || !semester || !mobileNumber || !college || !email || !eventName || !upiId || !transactionId) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Payment receipt is required." });
    }

    // Parse team members
    let parsedMembers = [];
    if (teamMembers) {
      try {
        parsedMembers = typeof teamMembers === "string" ? JSON.parse(teamMembers) : teamMembers;
      } catch {
        parsedMembers = [];
      }
    }

    // Build display filename
    const baseName = teamType === "team" && teamName ? teamName : name;
    const ext = req.file.originalname.match(/\.[a-zA-Z0-9]+$/)?.[0] || ".jpg";
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueLocalName = `${Date.now()}-${cleanBaseName}${ext}`;
    const filename = `${cleanBaseName}${ext}`;

    // Base64 buffer for guaranteed database persistence (works on Vercel serverless & local)
    const base64Data = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype || "image/jpeg";

    let paymentReceiptUrl = "";
    let paymentReceiptFileId = "";

    // Save locally if disk is writable
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const localFilePath = path.join(uploadsDir, uniqueLocalName);
      await fs.promises.writeFile(localFilePath, req.file.buffer);

      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
      const host = req.get("host") || `localhost:${process.env.PORT || 5005}`;
      paymentReceiptUrl = `${protocol}://${host}/uploads/${uniqueLocalName}`;
    } catch (saveErr) {
      console.warn("⚠️ Local file write skipped:", saveErr.message);
    }

    // Upload to Google Drive (if Webhook or Service Account configured)
    let driveUploaded = false;
    if (
      process.env.GOOGLE_DRIVE_WEBHOOK_URL ||
      (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
    ) {
      try {
        const driveResult = await uploadToDrive(req.file.buffer, filename, req.file.mimetype);
        if (driveResult?.webViewLink) {
          paymentReceiptUrl = driveResult.webViewLink;
          paymentReceiptFileId = driveResult.fileId;
          driveUploaded = true;
        }
      } catch (driveErr) {
        console.warn("⚠️ Google Drive upload failed:", driveErr.message);
      }
    }

    // Save to MongoDB (Omit heavy base64 if Drive succeeded to save Atlas quota)
    const registration = new Registration({
      name, rollNumber, program, semester, mobileNumber,
      college, email,
      eventId: eventId || undefined,
      eventName,
      teamType: teamType || "individual",
      teamName: teamName || "",
      teamMembers: parsedMembers,
      upiId, transactionId,
      paymentReceiptUrl: paymentReceiptUrl || `/api/registrations/receipt/temp`,
      paymentReceiptFileId,
      paymentReceiptData: driveUploaded ? "" : base64Data, // Save base64 only if Drive upload failed
      paymentReceiptMimeType: mimeType,
      whatsappLink: whatsappLink || "#",
    });

    await registration.save();

    // If neither Drive link nor local file, set canonical receipt url pointing to DB stream
    if (!paymentReceiptUrl || paymentReceiptUrl.includes("/uploads/")) {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
      const host = req.get("host") || `localhost:${process.env.PORT || 5005}`;
      registration.paymentReceiptUrl = `${protocol}://${host}/api/registrations/receipt/${registration._id}`;
      await registration.save();
    }

    // Respond immediately to user (Confirmation email will be sent after Admin approves registration)
    res.status(200).json({
      message: "Registration submitted successfully! You will receive a confirmation email once your payment is verified.",
      registrationId: registration._id,
    });
  } catch (err) {
    console.error("Registration error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  }
});

// ─── ADMIN (JWT protected) ────────────────────────────

// GET /api/admin/registrations — All registrations
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const { event, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (event) filter.eventName = { $regex: event, $options: "i" };
    if (status) filter.status = status;

    const total = await Registration.countDocuments(filter);
    const registrations = await Registration.find(filter)
      .select("-paymentReceiptData") // omit heavy base64 from listing
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, page: Number(page), registrations });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch registrations." });
  }
});

// GET /api/admin/registrations/stats — Dashboard stats
router.get("/admin/stats", authMiddleware, async (req, res) => {
  try {
    const total = await Registration.countDocuments();
    const confirmed = await Registration.countDocuments({ status: "confirmed" });
    const pending = await Registration.countDocuments({ status: "pending" });
    const rejected = await Registration.countDocuments({ status: "rejected" });

    // Per-event count
    const perEvent = await Registration.aggregate([
      { $group: { _id: "$eventName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Revenue estimate
    const revenueData = await Registration.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "eventData",
        },
      },
      { $unwind: { path: "$eventData", preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, totalRevenue: { $sum: "$eventData.fee" } } },
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({ total, confirmed, pending, rejected, perEvent, totalRevenue });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

// PUT /api/admin/registrations/:id — Update status & TRIGGER CONFIRMATION EMAIL & GOOGLE SHEET SYNC
router.put("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const { status, adminNote, forceSync, sendEmail: shouldSendEmail } = req.body;
    const previous = await Registration.findById(req.params.id);
    if (!previous) return res.status(404).json({ error: "Registration not found." });

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (adminNote !== undefined) updateFields.adminNote = adminNote;

    let reg = await Registration.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    let emailResult = null;
    let sheetResult = null;

    // If admin confirmed registration (or forceSync requested on confirmed registration)
    if (status === "confirmed" || (forceSync && reg.status === "confirmed")) {
      console.log(`🚀 [Admin Confirmation] Processing registration for ${reg.name} (${reg.email}). Sending confirmation email & syncing sheet...`);

      // Send email if status is confirmed or requested (unless explicitly sendEmail is false)
      const shouldTriggerEmail = shouldSendEmail !== false;
      const emailPromise = shouldTriggerEmail
        ? sendConfirmationEmail(reg.email, {
            name: reg.name,
            event: reg.eventName,
            teamName: reg.teamName,
            transactionId: reg.transactionId,
            whatsappLink: reg.whatsappLink,
          })
        : Promise.resolve({ skipped: true, reason: "Email sending disabled in request" });

      const sheetPromise = appendConfirmedRegistrationToSheet(reg);

      const [eRes, sRes] = await Promise.allSettled([emailPromise, sheetPromise]);

      const updatesAfterSync = {};

      if (eRes.status === "fulfilled") {
        emailResult = eRes.value;
        if (emailResult?.success) {
          updatesAfterSync.emailSentAt = new Date();
        }
        console.log("✅ Confirmation email result:", eRes.value);
      } else {
        console.error("❌ Confirmation email error:", eRes.reason?.message || eRes.reason);
        emailResult = { success: false, error: eRes.reason?.message || "Email failed" };
      }

      if (sRes.status === "fulfilled") {
        sheetResult = sRes.value;
        if (sheetResult?.success) {
          updatesAfterSync.sheetSyncedAt = new Date();
        }
        console.log(`✅ Google Sheet sync result for ${reg.name}:`, sRes.value?.success ? `Added to tab "${sRes.value?.sheetTitle}"` : sRes.value?.error);
      } else {
        console.error("❌ Google Sheet sync error:", sRes.reason?.message || sRes.reason);
        sheetResult = { success: false, error: sRes.reason?.message || "Sheet sync failed" };
      }

      if (Object.keys(updatesAfterSync).length > 0) {
        reg = await Registration.findByIdAndUpdate(
          req.params.id,
          updatesAfterSync,
          { new: true }
        );
      }
    }

    res.json({
      ...reg.toObject(),
      emailResult,
      sheetResult,
    });
  } catch (err) {
    console.error("Update registration error:", err);
    res.status(500).json({ error: "Failed to update registration." });
  }
});

// POST /api/admin/registrations/send-email/:id — Manually send / resend confirmation email
router.post("/admin/send-email/:id", authMiddleware, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ error: "Registration not found." });

    console.log(`📧 [Admin Manual Email] Sending confirmation email to ${reg.name} (${reg.email})...`);
    const emailResult = await sendConfirmationEmail(reg.email, {
      name: reg.name,
      event: reg.eventName,
      teamName: reg.teamName,
      transactionId: reg.transactionId,
      whatsappLink: reg.whatsappLink,
    });

    if (emailResult?.success) {
      const updated = await Registration.findByIdAndUpdate(
        req.params.id,
        { emailSentAt: new Date() },
        { new: true }
      );
      return res.json({
        message: `Confirmation email sent successfully to ${reg.email} via ${emailResult.provider || "Gmail"}!`,
        emailResult,
        registration: updated,
      });
    } else {
      return res.status(500).json({
        error: emailResult.error || "Failed to send confirmation email.",
        emailResult,
      });
    }
  } catch (err) {
    console.error("Send email error:", err);
    res.status(500).json({ error: err.message || "Failed to send confirmation email." });
  }
});

// POST /api/admin/registrations/sync-sheet/:id — Manually sync an individual registration to Google Sheet
router.post("/admin/sync-sheet/:id", authMiddleware, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ error: "Registration not found." });

    console.log(`📊 [Manual Sync] Appending registration for ${reg.name} to Google Sheet...`);
    const sheetResult = await appendConfirmedRegistrationToSheet(reg);

    if (sheetResult.success) {
      const updated = await Registration.findByIdAndUpdate(
        req.params.id,
        { sheetSyncedAt: new Date() },
        { new: true }
      );
      return res.json({
        message: `Successfully synced to Google Sheet under tab "${sheetResult.sheetTitle}"!`,
        registration: updated,
        sheetResult,
      });
    } else {
      return res.status(500).json({
        error: sheetResult.error || "Failed to append row to Google Sheet.",
        sheetResult,
      });
    }
  } catch (err) {
    console.error("Sync sheet error:", err);
    res.status(500).json({ error: err.message || "Failed to sync to Google Sheet." });
  }
});

// POST /api/admin/registrations/sync-all — Sync all confirmed registrations to Google Sheets
router.post("/admin/sync-all", authMiddleware, async (req, res) => {
  try {
    const confirmedRegs = await Registration.find({ status: "confirmed" }).sort({ createdAt: 1 });
    if (confirmedRegs.length === 0) {
      return res.json({ message: "No confirmed registrations found to sync.", syncedCount: 0, total: 0 });
    }

    console.log(`📊 [Bulk Sync] Syncing ${confirmedRegs.length} confirmed registrations to Google Sheets...`);
    const results = [];

    for (const reg of confirmedRegs) {
      const sResult = await appendConfirmedRegistrationToSheet(reg);
      if (sResult.success) {
        await Registration.findByIdAndUpdate(reg._id, { sheetSyncedAt: new Date() });
      }
      results.push({
        id: reg._id,
        name: reg.name,
        eventName: reg.eventName,
        ...sResult,
      });
    }

    const successCount = results.filter((r) => r.success).length;
    res.json({
      message: `Synced ${successCount} of ${confirmedRegs.length} registrations to Google Sheets.`,
      total: confirmedRegs.length,
      syncedCount: successCount,
      results,
    });
  } catch (err) {
    console.error("Sync all error:", err);
    res.status(500).json({ error: err.message || "Failed to sync registrations to Google Sheets." });
  }
});

// GET /api/admin/registrations/export — Export CSV
router.get("/admin/export", authMiddleware, async (req, res) => {
  try {
    const { event, status } = req.query;
    const filter = {};
    if (event) filter.eventName = { $regex: event, $options: "i" };
    if (status) filter.status = status;

    const registrations = await Registration.find(filter).sort({ createdAt: -1 });

    const header = [
      "Name", "Roll Number", "Program", "Semester", "Mobile",
      "College", "Email", "Event", "Team Type", "Team Name",
      "UPI ID", "Transaction ID", "Status", "Receipt URL", "Submitted At"
    ].join(",");

    const rows = registrations.map((r) => [
      `"${r.name}"`, `"${r.rollNumber}"`, `"${r.program}"`, `"${r.semester}"`,
      `"${r.mobileNumber}"`, `"${r.college}"`, `"${r.email}"`,
      `"${r.eventName}"`, `"${r.teamType}"`, `"${r.teamName || "-"}"`,
      `"${r.upiId}"`, `"${r.transactionId}"`, `"${r.status}"`,
      `"${r.paymentReceiptUrl || "-"}"`,
      `"${new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}"`,
    ].join(","));

    const csv = [header, ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=registrations_${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Export failed." });
  }
});

export default router;
