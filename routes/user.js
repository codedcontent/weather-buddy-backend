const express = require("express");
const router = express.Router();
const { createAccount } = require("../controllers/userController");

router.post("/users", createAccount);

module.exports = router;
