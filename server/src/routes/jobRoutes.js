import express from "express";
import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { uploadResume } from "../controllers/jobController.js";


const router = express.Router();

// All routes are protected
router.route("/")
  .post(protect, createJob)
  .get(protect, getJobs);

router.route("/:id")
  .put(protect, updateJob)
  .delete(protect, deleteJob);

  router.put(
  "/:id/resume",
  protect,
  upload.single("resume"),
  uploadResume
);

export default router;