// /providers/flightProvider.js
const duffel = require("../config/duffelClient");

// Convertir une Offre Duffel → Offre propre (frontend)
function mapDuffelOffer(offer) {
  const slice = offer.slices?.[0];
  const segment = slice?.segments?.[0];

  return {
    id: offer.id,

    // Airline
    airlineName: offer.owner?.name ?? null,
    airlineCode: offer.owner?.iata_code ?? null,
    airlineLogoUrl:
      offer.owner?.logo_symbol_url ||
      offer.owner?.logo_lockup_url ||
      null,

    // Timing
    departureTime: segment?.departing_at ?? null,
    arrivalTime: segment?.arriving_at ?? null,

    // Airports
    departureAirportCode: segment?.origin?.iata_code,
    departureAirportName: segment?.origin?.name,
    departureCity: segment?.origin?.city_name,

    arrivalAirportCode: segment?.destination?.iata_code,
    arrivalAirportName: segment?.destination?.name,
    arrivalCity: segment?.destination?.city_name,

    // Duration + stops
    duration: slice?.duration ?? null,
    stops: (slice?.segments?.length ?? 1) - 1,

    // Price
    priceAmount: offer.total_amount ? parseFloat(offer.total_amount) : null,
    priceCurrency: offer.total_currency ?? null,
  };
}

exports.searchFlights = async ({ from, to, date, currency }) => {
  try {
    const response = await duffel.offerRequests.create({
      slices: [
        {
          origin: from,
          destination: to,
          departure_date: date,
        },
      ],
      passengers: [{ type: "adult" }],
      cabin_class: "economy",
      return_offers: true,
      currency,
    });

    const offers = response?.data?.offers ?? [];
    return offers.map(mapDuffelOffer);
  } catch (err) {
    console.error("❌ Duffel API error:", err);
    throw new Error("Duffel API error");
  }
};