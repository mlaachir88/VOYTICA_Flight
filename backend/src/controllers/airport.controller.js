const airportsData = require("../data/airports.json");

// Fonction de recherche intelligente
const searchAirports = (req, res) => {
  try {
    const { q } = req.query;

    // Si pas de query, retourner vide
    if (!q || q.length < 1) {
      return res.json([]);
    }

    const query = q.toLowerCase().trim();
    const airports = airportsData.airports;

    // Recherche intelligente : code, ville, nom d'aéroport, pays
    const results = airports.filter((airport) => {
      const code = airport.code.toLowerCase();
      const city = airport.city.toLowerCase();
      const name = airport.name.toLowerCase();
      const country = airport.country.toLowerCase();

      return (
        code.includes(query) ||
        city.includes(query) ||
        name.includes(query) ||
        country.includes(query)
      );
    });

    // Limiter à 10 résultats max
    const limitedResults = results.slice(0, 10);

    res.json(limitedResults);
  } catch (error) {
    console.error("❌ Airport search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Valider un code IATA
const validateAirportCode = (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const upperCode = code.toUpperCase();
    const airports = airportsData.airports;

    // Chercher le code exact
    const airport = airports.find((a) => a.code === upperCode);

    if (airport) {
      return res.json({
        valid: true,
        airport,
      });
    } else {
      return res.json({
        valid: false,
        message: "Invalid IATA code",
      });
    }
  } catch (error) {
    console.error("❌ Validate code error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Obtenir info d'un aéroport par code
const getAirportByCode = (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const upperCode = code.toUpperCase();
    const airports = airportsData.airports;

    const airport = airports.find((a) => a.code === upperCode);

    if (airport) {
      return res.json(airport);
    } else {
      return res.status(404).json({ error: "Airport not found" });
    }
  } catch (error) {
    console.error("❌ Get airport error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  searchAirports,
  validateAirportCode,
  getAirportByCode,
};