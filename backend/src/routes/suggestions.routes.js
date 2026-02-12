const express = require("express");
const router = express.Router();
const suggestionsController = require("../controllers/suggestions.controller");

router.get("/airports", suggestionsController.airportSuggestions);

module.exports = router;