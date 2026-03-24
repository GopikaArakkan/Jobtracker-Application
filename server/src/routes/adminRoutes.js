import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getAdminStats, getAllUsers, getAllJobs, getAdminActivity } from "../controllers/adminController.js";
import { deleteUser } from "../controllers/adminController.js";
import { deleteJob } from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/jobs", protect, adminOnly, getAllJobs);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.delete("/jobs/:id", protect, adminOnly, deleteJob);
router.get("/activity", protect, adminOnly, getAdminActivity);
export default router;