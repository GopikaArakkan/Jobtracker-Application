import JobApplication from "../models/JobApplication.js";

/**
 * @desc    Create a new job application      here it Creates a job application andAutomatically links it to the logged-in user
 * @route   POST /api/jobs              
 * @access  Private
 */
export const createJob = async (req, res) => {                                 
  try { 
    const { company, role, location, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    const job = await JobApplication.create({
      user: req.user._id,
      company,
      role,
      location,
      notes,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all jobs of logged-in user                  here it Returns only the jobs of the logged-in user and Sorted by latest first
 * @route   GET /api/jobs
 * @access  Private
 */
export const getJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update job (status / details)                 Updates status/details Prevents users from editing others’ jobs
 * @route   PUT /api/jobs/:id
 * @access  Private
 */
export const updateJob = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure user owns the job
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedJob = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete job
 * @route   DELETE /api/jobs/:id                 //Deletes a job Ownership check included
 * @access  Private
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure user owns the job
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await job.deleteOne();

    res.status(200).json({ message: "Job removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload resume for a job
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Save file path in DB
    job.resume = `uploads/resumes/${req.file.filename}`;
    await job.save();

    res.json({
      message: "Resume uploaded successfully",
      resume: job.resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Resume upload failed" });
  }
};