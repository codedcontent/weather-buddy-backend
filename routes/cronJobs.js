const { cronWeatherNotify, createCronJob } = require("../controllers/cronJobsController");

const router = require("express").Router();

// Notify user on weather update
router.post("/", createCronJob);

// Notify user on weather update
router.post("/:id", cronWeatherNotify);

module.exports = router;
