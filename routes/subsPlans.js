const router = require("express").Router();
const subscriptionsController = require("../controllers/subscriptionsController");
const authenticateToken = require("../utils/authenticateToken");

router.patch("/", authenticateToken, subscriptionsController.upgradePlan);

module.exports = router;
