const categoryCRUDRouter = require("./routes/category.router");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middlewares/authMiddleware");
router.use(verifyToken);
router.use("/", categoryCRUDRouter);
module.exports = router;
