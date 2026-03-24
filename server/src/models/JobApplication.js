import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
    },
    location: String,
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    notes: String,
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    resume: {
  type: String, // file path
   default: null,
  
},
lastReminderSent: {
  type: Date,
}
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);