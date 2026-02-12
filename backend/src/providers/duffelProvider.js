const axios = require("axios");

const DUFFEL_API_URL = "https://api.duffel.com/air/offer_requests";
const DUFFEL_TOKEN = process.env.DUFFEL_API_KEY;

exports.searchFlights = async ({ from, to, date, currency }) => {
  try {
    console.log("🔑 DUFFEL TOKEN utilisé :", DUFFEL_TOKEN?.slice(0, 15) + "********");

    const requestBody = {
      data: {
        slices: [
          {
            origin: from,
            destination: to,
            departure_date: date,
          },
        ],
        passengers: [{ type: "adult" }],
        cabin_class: "economy",
        preferred_currencies: [currency],
      },
    };

    console.log("✈️ Envoi requête Duffel (v2)...");

    const response = await axios.post(DUFFEL_API_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${DUFFEL_TOKEN}`,
        "Duffel-Version": "v2",
        "Content-Type": "application/json",
      },
    });

    // ➤ LOG RÉPONSE TOTALE DUFFEL
    console.log("🟦 RAW DUFFEL RESPONSE:");
    console.log(JSON.stringify(response.data, null, 2));

    // -------------------------
    // 🔍 EXTRACTION ULTRA SÛRE
    // -------------------------

    const offers =
      response.data?.data?.offers ??
      response.data?.data ??
      response.data?.offers ??
      [];

    if (!Array.isArray(offers)) {
      console.log("⚠️ Duffel n’a pas renvoyé un tableau d’offres !");
      return [];
    }

    console.log(`✅ ${offers.length} offres trouvées.`);

    // -------------------------
    // 🔄 TRANSFORMATION FORMAT
    // -------------------------
    return offers.map((offer) => {
      const slice = offer?.slices?.[0];
      const segment = slice?.segments?.[0];
      const carrier = segment?.operating_carrier || segment?.marketing_carrier;

      return {
        id: offer.id ?? null,
        airline: carrier?.name ?? "Unknown airline",
        logo:
          carrier?.logo_lockup_url ||
          carrier?.logo_symbol_url ||
          offer?.owner?.logo_lockup_url ||
          null,
        price: Number(offer.total_amount) || null,
        currency: offer.total_currency || currency,
        origin: segment?.origin?.iata_code || from,
        destination: segment?.destination?.iata_code || to,
        departureTime: segment?.departing_at || null,
        arrivalTime: segment?.arriving_at || null,
        duration: segment?.duration || null,
        stops: slice?.segments?.length > 1 ? slice.segments.length - 1 : 0,
      };
    });
  } catch (error) {
    console.error("❌ Duffel API ERROR:");
    console.error(error?.response?.data || error.message);
    return [];
  }
};