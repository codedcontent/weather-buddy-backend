const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Keeping the API simple
 */

// Cron jobs
app.post("/crons", (req, res) => {
  const { payload } = req.body;

  console.log({ payload });
  res.end();
});

// Weather Buddy web app
app.post("/create", (req, res) => {
  const { weatherDetails, accountDetails } = req.body;

  /**
   * The main app should send the following
   * Weather details
   * Users first and last names
   * Email - which server will use for verification
   */

  const msg = "<<some-message>>";
  return res.status(200).json({ msg });
});

// <<messaging-api>>

app.listen(port, () => {
  console.log("Server is running on port:" + port);
});
