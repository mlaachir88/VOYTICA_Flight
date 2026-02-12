// src/lib/api.ts

export interface FlightSearchParams {
  from: string; // ex: "PAR"
  to: string;   // ex: "CMN"
  date: string; // ex: "2026-02-05"
}

/**
 * Modèle utilisé par tout le frontend (Search.tsx, FlightCard, Map, etc.)
 * Il est volontairement large et optionnel pour ne rien casser même si
 * certains champs ne sont pas encore renvoyés par le backend.
 */
export interface FlightOffer {
  id: string;

  // Compagnie
  airlineName?: string;      // ex: "Royal Air Maroc"
  airlineCode?: string;      // ex: "AT"
  airlineLogoUrl?: string;   // URL logo Duffel

  // Départ
  departureAirportCode?: string;  // ex: "CDG"
  departureAirportName?: string;  // ex: "Paris Charles de Gaulle"
  departureCity?: string;         // ex: "Paris"
  departureTime?: string;         // ISO ex: "2026-02-05T15:20:00"

  // Arrivée
  arrivalAirportCode?: string;    // ex: "CMN"
  arrivalAirportName?: string;    // ex: "Mohammed V International Airport"
  arrivalCity?: string;           // ex: "Casablanca"
  arrivalTime?: string;           // ISO

  // Vol
  duration?: string;              // ex: "PT3H10M" (ISO Duffel)
  stops?: number;                 // nb d’escales

  // Prix
  priceAmount?: number;           // ex: 129.99
  priceCurrency?: string;         // ex: "EUR"

  // Coordonnées (pour la carte)
  departureLatitude?: number;
  departureLongitude?: number;
  arrivalLatitude?: number;
  arrivalLongitude?: number;

  // On garde ces champs génériques pour compat rétro
  airline?: string;
  origin?: string;
  destination?: string;
  departureTimeRaw?: string;
  arrivalTimeRaw?: string;
  durationMinutes?: number;
  price?: number;
  currency?: string;
}

// Base URL du backend
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function searchFlights(
  params: FlightSearchParams
): Promise<FlightOffer[]> {
  const response = await fetch(`${API_BASE_URL}/api/flights/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Flight search failed");
  }

  const data = await response.json();

  // On accepte plusieurs formats possibles pour rester tolérant :
  // { flights: [...] } ou { offers: [...] } ou { data: { offers: [...] } } etc.
  const rawOffers =
    data.flights || data.offers || data.data?.offers || data.data || [];

  // On ne remappe pas ici : on suppose que le backend renvoie déjà
  // des objets conformes au modèle FlightOffer (airlineName, priceAmount, etc.)
  // Si ce n’est pas le cas, tu pourras ajuster le mapping ici.
  const offers: FlightOffer[] = rawOffers;

  return offers;
}
