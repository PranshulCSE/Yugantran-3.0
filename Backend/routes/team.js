import express from "express";
import Team from "../models/Team.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/team — All active team members (public)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const team = await Team.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team." });
  }
});

// Admin CRUD
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    const team = await Team.find().sort({ order: 1, category: 1 });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team." });
  }
});

router.post("/admin", authMiddleware, async (req, res) => {
  try {
    const member = new Team(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to add member." });
  }
});

router.put("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: "Member not found." });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Failed to update member." });
  }
});

router.delete("/admin/:id", authMiddleware, async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Member removed." });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove member." });
  }
});

export default router;
