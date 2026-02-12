const express = require("express");
const router = express.Router();
const airportController = require("../controllers/airport.controller");

// GET /api/airports/search?q=paris
router.get("/search", airportController.searchAirports);

// GET /api/airports/validate/:code
router.get("/validate/:code", airportController.validateAirportCode);

// GET /api/airports/:code
router.get("/:code", airportController.getAirportByCode);

module.exports = router;