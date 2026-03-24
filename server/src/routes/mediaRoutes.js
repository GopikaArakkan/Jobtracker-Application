import express from "express";
import Media from "../models/Media.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ ADD
router.post("/", protect, async (req, res) => {
  const media = await Media.create({
    user: req.user._id,
    name: req.body.name,
    type: req.body.type,
    url: req.body.url
  });

  res.json(media);
});

// 📥 GET
router.get("/", protect, async (req, res) => {
  const media = await Media.find({ user: req.user._id });
  res.json(media);
});

// ❌ DELETE
router.delete("/:id", protect, async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✏️ RENAME
router.put("/:id", protect, async (req, res) => {
  const media = await Media.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  res.json(media);
});

export default router;