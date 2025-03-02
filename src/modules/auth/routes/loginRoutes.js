const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
router.post("/email", loginController.loginWithEmailPassword);
router.post("/google", loginController.loginWithGoogle);
router.post("/facebook", loginController.loginWithFacebook);
router.get("/verify-email/:token", loginController.verifyEmail); // New verification route
module.exports = router;
