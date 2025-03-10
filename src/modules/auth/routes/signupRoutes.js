const express = require("express");
const SignupController = require("../controllers/signupController");
const router = express.Router();

router.post("/Register", SignupController.register);  
router.post("/verify-email", SignupController.verifyEmail);

module.exports = router;