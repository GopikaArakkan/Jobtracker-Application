import cron from "node-cron";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import Notification from "../models/Notification.js";

cron.schedule("* * * * *", async () => {
  console.log("Checking for stale job applications...");
  
  const jobs = await JobApplication.find({ status: "Applied" });
  const now = new Date();

  for (let job of jobs) {
    const daysOld =
      (now - new Date(job.appliedDate)) /
      (1000 * 60 * 60 * 24);

    if (daysOld >= 5) {
      if (
        !job.lastReminderSent ||
        (now - job.lastReminderSent) > 24 * 60 * 60 * 1000
      ) {
        const user = await User.findById(job.user);
        console.log("Job user:", job.user);
if (!user) {
  console.log("User not found for job:", job._id);
   continue;
}

console.log("Sending reminder to:", user._id);

        console.log(`Reminder: Follow up with ${job.company}`);

        // Save notification FIRST
     const existing = await Notification.findOne({
  user: job.user,
  message: `Follow up with ${job.company}`,
  createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
});

if (!existing) {
  await Notification.create({
    user: job.user,
    message: `Follow up with ${job.company}`
  });
}

        // Try sending email
        try {
          await sendEmail(
            user.email,
            "Job Application Reminder",
            `Hi ${user.name},

It's been ${Math.floor(daysOld)} days since you applied to ${job.company}.

Consider sending a follow-up email.

Best,
Job Tracker`
          );
        } catch (error) {
          console.log("Email failed but notification saved");
        }

        job.lastReminderSent = now;
        await job.save();
      }
    }
  }
});