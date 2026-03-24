import express from "express";
import Todo from "../models/Todo.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ➕ ADD TODO
router.post("/", protect, async (req, res) => {
  const todo = await Todo.create({
    user: req.user._id,
    text: req.body.text,
  });

  res.json(todo);
});


// 📥 GET TODOS
router.get("/", protect, async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  res.json(todos);
});


// ❌ DELETE TODO
router.delete("/:id", protect, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

router.put("/:id", protect, async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(todo);
});

export default router;