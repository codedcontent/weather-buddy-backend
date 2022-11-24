const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../utils/authenticateToken");

// Get user account details
router.get("/:user_id", authenticateToken, userController.getAccountDetails);

// Create a new user account
router.post("/", userController.createAccount);

// Update users account details
router.patch("/:user_id", authenticateToken, userController.updateDetails);

module.exports = router;
