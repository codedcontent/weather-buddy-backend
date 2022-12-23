const dotenv = require("dotenv");
dotenv.config();
const pool = require("./config/database");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");
const cronJobs = require("./cron-jobs");
const authenticateToken = require("./utils/authenticateToken");

const app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

/**
 * Keeping the API simple
 */

app.get("/", (req, res) => {
  res.json("HELLO");
});

// Auth route
const auth = require("./routes/auth");
app.use("/api/auth", auth);

// User accounts route
const user = require("./routes/user");
app.use("/api/users", user);

// Subscription plans route
const subPlansRouter = require("./routes/subsPlans");
app.use("/api/sub-plans", subPlansRouter);

// Messaging route
const weatherRoute = require("./routes/weather");
app.use("/api/weather", weatherRoute);

app.listen(port, () => {
  console.log("Server is running on port:" + port);

  // Create cron job for 5:00 AM
  cron.schedule("52 12 * * *", () => {
    cronJobs.fiveAmCronJob();
  });

  // Create cron job for 10:00 AM
  cron.schedule("0 10 * * *", () => {
    cronJobs.tenAmCronJob();
  });

  // Create cron job for 3:00 PM
  cron.schedule("0 15 * * *", () => {
    cronJobs.threePmCronJob();
  });

  // Create cron job for 8:00 AM
  cron.schedule("0 20 * * *", () => {
    cronJobs.eightPmCronJob();
  });
});
