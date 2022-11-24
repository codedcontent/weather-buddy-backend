const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../utils/authenticateToken");

// Route to login
router.post("/login", authController.login);

// Route to send password reset url to the users email
router.post("/forgot-password", authController.forgotPassword);

// Route to change the users password
router.post("/reset-password", authController.resetPassword);

// Route to test-get the reset password url
router.get("/reset-password/:resetPasswordToken", (req, res) => {
  res.send(req.params);
});

// Route to refresh auth tokens
router.post("/refresh-token", authController.refreshToken);

// Route to logout user
router.post("/logout", authenticateToken, authController.logOut);

module.exports = router;
