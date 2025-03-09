const express = require("express");
const {
  requestPasswordReset,
  resetPassword,
  verifyCode,
} = require("../controllers/resetPasswordController");
const router = express.Router();

router.post("/request-reset-password", requestPasswordReset);
router.post("/verify-code", verifyCode); 
router.post("/reset-password", resetPassword);

module.exports = router;
