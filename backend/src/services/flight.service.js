const { convert } = require("../utils/currency");

function generateStaticFlights(from, to, date) {
  return [
    {
      id: "FL001",
      origin: from,
      destination: to,
      airline: "Air France",
      departureTime: `${date}T06:55:00`,
      arrivalTime: `${date}T09:15:00`,
      duration: 140,
      basePriceEUR: 89,
      stops: 0,
    },
    {
      id: "FL002",
      origin: from,
      destination: to,
      airline: "Iberia",
      departureTime: `${date}T11:20:00`,
      arrivalTime: `${date}T13:45:00`,
      duration: 145,
      basePriceEUR: 78,
      stops: 0,
    },
    {
      id: "FL003",
      origin: from,
      destination: to,
      airline: "Ryanair",
      departureTime: `${date}T15:40:00`,
      arrivalTime: `${date}T18:25:00`,
      duration: 165,
      basePriceEUR: 52,
      stops: 1,
    },
  ];
}

exports.getStaticFlights = (from, to, date, currency, filters) => {
  let flights = generateStaticFlights(from, to, date);

  // Conversion des prix
  flights = flights.map((flight) => ({
    ...flight,
    price: convert(flight.basePriceEUR, "EUR", currency),
    currency,
  }));

  // FILTRES
  if (filters.direct === "true") {
    flights = flights.filter((f) => f.stops === 0);
  }

  if (filters.maxPrice) {
    flights = flights.filter((f) => f.price <= Number(filters.maxPrice));
  }

  if (filters.maxStops) {
    flights = flights.filter((f) => f.stops <= Number(filters.maxStops));
  }

  // TRI
  if (filters.sort === "price_asc") {
    flights = flights.sort((a, b) => a.price - b.price);
  } else if (filters.sort === "price_desc") {
    flights = flights.sort((a, b) => b.price - a.price);
  } else if (filters.sort === "duration_asc") {
    flights = flights.sort((a, b) => a.duration - b.duration);
  } else if (filters.sort === "duration_desc") {
    flights = flights.sort((a, b) => b.duration - a.duration);
  }

  return flights;
};