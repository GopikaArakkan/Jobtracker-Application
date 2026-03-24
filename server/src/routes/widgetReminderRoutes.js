import express from "express";
import Reminder from "../models/Reminder.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ ADD (widget)
router.post("/", protect, async (req, res) => {
  const reminder = await Reminder.create({
    user: req.user._id,
    text: req.body.text,
    time: req.body.time
  });

  res.json(reminder);
});

// 📥 GET (widget)
router.get("/", protect, async (req, res) => {
  const reminders = await Reminder.find({ user: req.user._id });
  res.json(reminders);
});

// ❌ DELETE (widget)
router.delete("/:id", protect, async (req, res) => {
  await Reminder.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✅ UPDATE (widget)
router.put("/:id", protect, async (req, res) => {
  const reminder = await Reminder.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(reminder);
});

export default router;