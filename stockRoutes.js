const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

router.get("/:symbol", stockController.getCombinedData);

module.exports = router;
