// /routes/flight.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/flight.controller");

router.post("/search", controller.searchFlights);

module.exports = router;