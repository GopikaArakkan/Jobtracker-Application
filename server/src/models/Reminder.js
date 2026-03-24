import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  text: String,

  // ⭐ ADD THESE (for widget only)
  time: String,
  completed: {
    type: Boolean,
    default: false
  },
  notified: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Reminder", reminderSchema);