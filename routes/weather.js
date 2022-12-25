const router = require("express").Router();
const weatherController = require("../controllers/weatherController");

// Add users weather details
router.post("/:user_id", weatherController.addTrackingDetails);

// Send user their weather details
router.post("/cron", weatherController.sendWeatherDetails);

module.exports = router;
