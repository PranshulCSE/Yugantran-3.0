import express from "express";
import Event from "../models/Event.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── PUBLIC ─────────────────────────────────────────

// GET /api/events — All active events (public)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

// GET /api/events/:slug — Single event by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug, isActive: true });
    if (!event) return res.status(404).json({ error: "Event not found." });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event." });
  }
});

// ─── ADMIN (JWT protected) ────────────────────────────

// GET /api/admin/events — All events including inactive
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find().sort({ order: 1, createdAt: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

// POST /api/admin/events — Create event
router.post("/admin", authMiddleware, async (req, res) => {
  try {
    const slug =
      req.body.slug ||
      req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const event = new Event({ ...req.body, slug });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Event with this name/slug already exists." });
    }
    res.status(500).json({ error: err.message || "Failed to create event." });
  }
});

// PUT /api/admin/events/:id — Update event
router.put("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ error: "Event not found." });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update event." });
  }
});

// DELETE /api/admin/events/:id — Delete event
router.delete("/admin/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });
    res.json({ message: "Event deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event." });
  }
});

export default router;
