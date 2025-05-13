const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const { verifyToken } = require("@middlewares/authMiddleware");
/**
 * @swagger
 * /api/auth/email:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post("/email", loginController.loginWithEmailPassword);
/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login with Google
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post("/google", loginController.loginWithGoogle);
/**
 * @swagger
 * /api/auth/facebook:
 *   post:
 *     summary: Login with Facebook
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post("/facebook", loginController.loginWithFacebook);
/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", verifyToken, loginController.getProfile);
/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Email verified
 *       400:
 *         description: Invalid token
 */
router.get("/verify-email/:token", loginController.verifyEmail); // New verification route
/**
 * @swagger
 * /api/auth/verify-device/{token}:
 *   get:
 *     summary: Verify device
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Device verification token
 *     responses:
 *       200:
 *         description: Device verified
 *       400:
 *         description: Invalid token
 */
router.get("/verify-device/:token", loginController.verifyDevice);
module.exports = router;
