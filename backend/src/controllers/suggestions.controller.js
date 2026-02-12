const suggestionsService = require("../services/suggestions.service");

exports.airportSuggestions = (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.json({ airports: [] });
    }

    const results = suggestionsService.searchAirports(q);

    return res.json({
      query: q,
      results,
      total: results.length,
    });
  } catch (err) {
    console.error("Suggestions error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};