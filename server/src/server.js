import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; //1.
import authRoutes from "./routes/authRoutes.js";   //3.
import { protect } from "./middleware/authMiddleware.js";  //5.
import jobRoutes from "./routes/jobRoutes.js";   //7.
import adminRoutes from "./routes/adminRoutes.js";  //8.
import path from "path"; //9.
import "./cron/reminderCron.js"; //10.
import notificationRoutes from "./routes/notificationRoutes.js";  //11.
import todoRoutes from "./routes/todoRoutes.js"; //12.
import widgetReminderRoutes from "./routes/widgetReminderRoutes.js"; //13.
import mediaRoutes from "./routes/mediaRoutes.js"; //14.
import userRoutes from "./routes/userRoutes.js"; //15.



dotenv.config();

const app = express();

connectDB();    //2.

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes); //4.
app.use("/api/jobs", jobRoutes); //7.
app.use("/api/admin", adminRoutes);  //8.
app.use("/uploads", express.static("uploads"));  //9.
app.use("/api/notifications", notificationRoutes);  //11.
app.use("/api/todos", todoRoutes); //12.
app.use("/api/widget-reminders", widgetReminderRoutes); //13.
app.use("/api/media", mediaRoutes); //14.
app.use("/api/user", userRoutes); //15.



// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "Access granted", user: req.user });   //6.
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});