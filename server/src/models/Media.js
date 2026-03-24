import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  type: String, // "file" or "link"
  url: String
}, { timestamps: true });

export default mongoose.model("Media", mediaSchema);