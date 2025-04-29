const categoryCRUDRouter = require("./routes/category.router");
const express = require("express");
const router = express.Router();
router.use("/", categoryCRUDRouter);
module.exports = router;
