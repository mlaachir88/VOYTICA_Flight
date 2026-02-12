const express = require("express");
const router = express.Router();
const currencyController = require("../controllers/currency.controller");

router.get("/rates", currencyController.getRates);
router.get("/convert", currencyController.convert);

module.exports = router;