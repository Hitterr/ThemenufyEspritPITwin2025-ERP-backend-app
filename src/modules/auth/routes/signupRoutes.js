const express = require("express");
const SignupController = require("../controllers/signupController");
const router = express.Router();

router.post("/Register", SignupController.register);  


module.exports = router;