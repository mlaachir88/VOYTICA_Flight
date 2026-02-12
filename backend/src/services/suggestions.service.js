const { AIRPORTS } = require("../utils/airports");

exports.searchAirports = (query) => {
  if (!query) return [];

  const q = query.toLowerCase();

  // matching intelligent
  return AIRPORTS.filter((item) =>
    item.city.toLowerCase().includes(q) ||
    item.airport.toLowerCase().includes(q) ||
    item.IATA.toLowerCase().includes(q)
  ).slice(0, 10); // max 10 résultats
};