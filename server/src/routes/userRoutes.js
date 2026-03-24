import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ UPDATE THEME
router.put("/theme", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { theme: req.body.theme },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update theme" });
  }
});

// ✅ GET THEME
router.get("/theme", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ theme: user.theme });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch theme" });
  }
});

export default router;