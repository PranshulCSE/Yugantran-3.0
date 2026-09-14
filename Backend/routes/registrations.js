import express from "express";
import Registration from "../models/Registration.js";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadToDrive } from "../services/driveService.js";
import { sendConfirmationEmail } from "../services/emailService.js";

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
    const ext = req.file.originalname.match(/\.[a-zA-Z0-9]+$/)?.[0] || "";
    const filename = `${baseName.replace(/\s+/g, "_")}${ext}`;

    // Respond immediately — don't make user wait for Drive/email
    res.status(200).json({ message: "Registration received! Confirmation email will be sent shortly." });

    // Upload to Google Drive (async, non-blocking)
    let paymentReceiptUrl = "";
    let paymentReceiptFileId = "";
    try {
      const driveResult = await uploadToDrive(req.file.buffer, filename, req.file.mimetype);
      paymentReceiptUrl = driveResult.webViewLink;
      paymentReceiptFileId = driveResult.fileId;
    } catch (driveErr) {
      console.error("❌ Drive upload failed:", driveErr.message);
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
