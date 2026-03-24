import mongoose from "mongoose";

const adminActivitySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // ⭐ creates createdAt automatically
  }
);

const AdminActivity = mongoose.model("AdminActivity", adminActivitySchema);

export default AdminActivity;