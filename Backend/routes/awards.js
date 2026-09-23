import express from "express";
import Award from "../models/Award.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/awards — All active awards (public)
router.get("/", async (req, res) => {
  try {
    const awards = await Award.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(awards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch awards." });
  }
});

// ─── ADMIN (JWT protected) ──────────────────────────

router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const awards = await Award.find().sort({ order: 1, createdAt: 1 });
    res.json(awards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch awards." });
  }
});

router.post("/admin", authMiddleware, async (req, res) => {
  try {
    const award = new Award(req.body);
    await award.save();
    res.status(201).json(award);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create award." });
  }
});

router.put("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const award = await Award.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!award) return res.status(404).json({ error: "Award not found." });
    res.json(award);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update award." });
  }
});

router.delete("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const award = await Award.findByIdAndDelete(req.params.id);
    if (!award) return res.status(404).json({ error: "Award not found." });
    res.json({ message: "Award deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete award." });
  }
});

export default router;
