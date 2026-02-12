const flightProvider = require("../providers/flightProvider");
const airportsData = require("../data/airports.json");

// Fonction helper pour valider code IATA
const validateIATACode = (code) => {
  const upperCode = code.toUpperCase();
  return airportsData.airports.find((a) => a.code === upperCode);
};

exports.searchFlights = async (req, res) => {
  try {
    const { from, to, date, returnDate, currency = "EUR" } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({ error: "from, to, and date are required" });
    }

    const fromAirport = validateIATACode(from);
    const toAirport = validateIATACode(to);

    if (!fromAirport) {
      return res.status(400).json({
        error: `Code d'aéroport de départ invalide: ${from}`,
        hint: "Utilisez un code IATA valide (ex: CDG, ORY, MAD)",
      });
    }

    if (!toAirport) {
      return res.status(400).json({
        error: `Code d'aéroport d'arrivée invalide: ${to}`,
        hint: "Utilisez un code IATA valide (ex: CDG, ORY, MAD)",
      });
    }

    // (optionnel mais propre) : si returnDate existe, vérifier qu’il est pas vide
    const cleanReturnDate =
      typeof returnDate === "string" && returnDate.trim() !== ""
        ? returnDate.trim()
        : null;

    const flights = await flightProvider.searchFlights({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      date,
      returnDate: cleanReturnDate, // ✅ NEW
      currency,
    });

    res.json({
      status: "success",
      results: flights.length,
      flights,
    });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};