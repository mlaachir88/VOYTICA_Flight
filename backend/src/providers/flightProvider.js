const duffel = require("../config/duffelClient");

function mapSlice(slice) {
  const segments = slice?.segments ?? [];
  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1];

  return {
    origin: firstSeg?.origin?.iata_code ?? null,
    destination: lastSeg?.destination?.iata_code ?? null,
    departureTime: firstSeg?.departing_at ?? null,
    arrivalTime: lastSeg?.arriving_at ?? null,
    duration: slice?.duration ?? null,
    stops: Math.max(0, segments.length - 1),

    // segments détaillés (timeline)
    segments: segments.map((s) => ({
      origin: s?.origin?.iata_code ?? null,
      destination: s?.destination?.iata_code ?? null,
      departingAt: s?.departing_at ?? null,
      arrivingAt: s?.arriving_at ?? null,
      duration: s?.duration ?? null,
      marketingCarrier: s?.marketing_carrier?.name ?? null,
      operatingCarrier: s?.operating_carrier?.name ?? null,
      flightNumber: s?.marketing_carrier_flight_number ?? null,
    })),
  };
}

function mapDuffelOffer(offer, fallback = {}) {
  const slices = offer?.slices ?? [];
  const mappedSlices = slices.map(mapSlice);

  const outbound = mappedSlices[0] ?? null;
  const inbound = mappedSlices[1] ?? null;

  // compagnie principale (pour le ticket)
  const firstSeg0 = slices?.[0]?.segments?.[0];
  const airline =
    firstSeg0?.marketing_carrier ||
    firstSeg0?.operating_carrier ||
    offer?.owner;

  const airlineName = airline?.name ?? offer?.owner?.name ?? "Unknown airline";
  const airlineCode = airline?.iata_code ?? offer?.owner?.iata_code ?? null;
  const airlineLogoUrl =
    airline?.logo_lockup_url ||
    airline?.logo_symbol_url ||
    offer?.owner?.logo_lockup_url ||
    offer?.owner?.logo_symbol_url ||
    null;

  return {
    id: offer?.id ?? null,

    // ✅ compat frontend actuel (FlightTicketCard / Modal)
    airline: airlineName,
    logo: airlineLogoUrl,
    price: offer?.total_amount ? Number(offer.total_amount) : null,
    currency: offer?.total_currency ?? fallback.currency ?? "EUR",
    origin: outbound?.origin ?? fallback.from ?? null,
    destination: outbound?.destination ?? fallback.to ?? null,
    departureTime: outbound?.departureTime ?? null,
    arrivalTime: outbound?.arrivalTime ?? null,
    duration: outbound?.duration ?? null,
    stops: outbound?.stops ?? 0,

    // ✅ tes champs “rich”
    airlineName,
    airlineCode,
    airlineLogoUrl,
    departureAirportCode: outbound?.origin ?? null,
    arrivalAirportCode: outbound?.destination ?? null,
    priceAmount: offer?.total_amount ? parseFloat(offer.total_amount) : null,
    priceCurrency: offer?.total_currency ?? null,

    // ✅ timeline : pour l’aller (tu l’affiches déjà)
    segments: outbound?.segments ?? [],

    // ✅ BONUS futur : aller + retour complet
    slices: mappedSlices,

    // ✅ BONUS rapide : champs retour (si tu veux l’afficher sans changer tout ton front)
    returnOrigin: inbound?.origin ?? null,
    returnDestination: inbound?.destination ?? null,
    returnDepartureTime: inbound?.departureTime ?? null,
    returnArrivalTime: inbound?.arrivalTime ?? null,
    returnDuration: inbound?.duration ?? null,
    returnStops: inbound?.stops ?? null,
    returnSegments: inbound?.segments ?? [],
  };
}

exports.searchFlights = async ({ from, to, date, returnDate, currency }) => {
  try {
    const slices = [{ origin: from, destination: to, departure_date: date }];

    // ✅ aller-retour
    if (returnDate) {
      slices.push({ origin: to, destination: from, departure_date: returnDate });
    }

    const response = await duffel.offerRequests.create({
      slices,
      passengers: [{ type: "adult" }],
      cabin_class: "economy",
      return_offers: true,
      currency,
    });

    const offers = response?.data?.offers ?? [];
    return offers.map((o) => mapDuffelOffer(o, { from, to, currency }));
  } catch (err) {
    console.error("❌ Duffel API error:", err?.response?.data || err?.message || err);
    throw new Error("Duffel API error");
  }
};