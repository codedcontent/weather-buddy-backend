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

app.get("/", authenticateToken, (req, res) => {
  const queryString = {
    create_user_table: `CREATE TABLE user (
      user_id INT PRIMARY KEY,
      first_name VARCHAR(40),
      last_name VARCHAR(40),
      email VARCHAR(40),
      password VARCHAR(40),
      phone VARCHAR(40),
      subscription_plan VARCHAR(40),
      tracking_id VARCHAR(40)
    )`,
    create_location_to_track_table: `CREATE TABLE location_to_track (
      tracking_id INT,
      location_id VARCHAR(40),
      latitude VARCHAR(40),
      longitude VARCHAR(40),
      PRIMARY KEY (tracking_id, location_id)
    )`,
    create_time_to_track_table: `CREATE TABLE time_to_track (
      location_id VARCHAR(40),
      time_id VARCHAR(40),
      time VARCHAR(20),
      PRIMARY KEY (location_id, time_id)
    )`,
    define_user_foreign_key: `
      ALTER TABLE user ADD FOREIGN KEY (tracking_id) REFERENCES location_to_track (tracking_id) ON DELETE SET NULL
    `,
    define_location_foreign_key: `
      ALTER TABLE location_to_track ADD FOREIGN KEY (location_id) REFERENCES time_to_track (location_id) ON DELETE CASCADE
    `,
    select_users: "SELECT * FROM user WHERE user_id = ?",
  };
  pool.query(queryString.select_users, [req.user_id], (err, results) => {
    res.send({ err, results, user_id: req.user_id });
  });

  // res.json("HELLO");
});

// Cron jobs
const cronJobsRoute = require("./routes/cronJobs");
app.use("/api/crons", cronJobsRoute);

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
