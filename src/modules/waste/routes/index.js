const express = require("express");
const router = express.Router();
const wasteRoutes=requir('./wasteRoute')

router.use("/waste",wasteRoutes)
module.exports = router;