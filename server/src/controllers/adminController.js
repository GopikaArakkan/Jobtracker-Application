import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import AdminActivity from "../models/AdminActivity.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await JobApplication.countDocuments();

    const statusStats = await JobApplication.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalJobs,
      statusStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// GET ALL JOB APPLICATIONS
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await JobApplication.find()
      .populate("user", "name email");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
};



export const deleteJob = async (req, res) => {
  try {
    const job = await JobApplication.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await JobApplication.findByIdAndDelete(req.params.id);

    await AdminActivity.create({
      message: `Admin removed job application: ${job.company}`,
    });

    res.json({ message: "Job deleted" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

      // ⭐ Prevent deleting admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot be deleted" });
    }

   await JobApplication.deleteMany({ user: user._id });
await User.findByIdAndDelete(req.params.id);

    // ⭐ Save activity
    await AdminActivity.create({
      message: `Admin deleted user: ${user.email}`,
    });

    res.json({ message: "User deleted" });

  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};



export const getAdminActivity = async (req, res) => {
  try {
    const activity = await AdminActivity
      .find()
      .sort({ createdAt: -1 })
      

    res.json(activity);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity" });
  }
};