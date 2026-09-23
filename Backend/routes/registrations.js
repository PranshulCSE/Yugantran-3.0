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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");

const router = express.Router();

// ─── PUBLIC ─────────────────────────────────────────

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

    // Respond immediately to user for best UX
    res.status(200).json({ message: "Registration received! Confirmation email will be sent shortly." });

    // Save locally first so receipt is NEVER lost
    let paymentReceiptUrl = "";
    let paymentReceiptFileId = "";

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
      console.error("⚠️ Local file save warning:", saveErr.message);
    }

    // Upload to Google Drive (if configured)
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      try {
        const driveResult = await uploadToDrive(req.file.buffer, filename, req.file.mimetype);
        if (driveResult?.webViewLink) {
          paymentReceiptUrl = driveResult.webViewLink;
          paymentReceiptFileId = driveResult.fileId;
        }
      } catch (driveErr) {
        console.warn("⚠️ Google Drive upload skipped/failed (using local receipt URL):", driveErr.message);
      }
    }

    // Save to MongoDB
    const registration = new Registration({
      name, rollNumber, program, semester, mobileNumber,
      college, email,
      eventId: eventId || undefined,
      eventName,
      teamType: teamType || "individual",
      teamName: teamName || "",
      teamMembers: parsedMembers,
      upiId, transactionId,
      paymentReceiptUrl,
      paymentReceiptFileId,
      whatsappLink: whatsappLink || "#",
    });
    await registration.save();

    // Send confirmation email
    await sendConfirmationEmail(email, {
      name, event: eventName, teamName, transactionId, whatsappLink,
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

    // Revenue estimate (sum fees from events)
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

// PUT /api/admin/registrations/:id — Update status
router.put("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const reg = await Registration.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );
    if (!reg) return res.status(404).json({ error: "Registration not found." });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: "Failed to update registration." });
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
