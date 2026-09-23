import express from "express";
import Domain from "../models/Domain.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/domains — All active domains/tracks (public)
router.get("/", async (req, res) => {
  try {
    const domains = await Domain.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(domains);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch domains." });
  }
});

// ─── ADMIN (JWT protected) ──────────────────────────

router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const domains = await Domain.find().sort({ order: 1, createdAt: 1 });
    res.json(domains);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch domains." });
  }
});

router.post("/admin", authMiddleware, async (req, res) => {
  try {
    const domain = new Domain(req.body);
    await domain.save();
    res.status(201).json(domain);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create domain." });
  }
});

router.put("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const domain = await Domain.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!domain) return res.status(404).json({ error: "Domain not found." });
    res.json(domain);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update domain." });
  }
});

router.delete("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const domain = await Domain.findByIdAndDelete(req.params.id);
    if (!domain) return res.status(404).json({ error: "Domain not found." });
    res.json({ message: "Domain deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete domain." });
  }
});

export default router;
