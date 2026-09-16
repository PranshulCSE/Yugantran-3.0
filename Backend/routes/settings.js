import express from "express";
import Settings from "../models/Settings.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/settings — Public settings
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

// GET /api/settings/admin — Same settings for admin panel
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

// PUT /api/settings/admin — Update settings (admin)
router.put("/admin", authMiddleware, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update settings." });
  }
});

export default router;

