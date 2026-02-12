// src/lib/api.ts
import { dedupeKeepCheapest } from "./flights.utils";

// ✅ AJOUT de returnDate
export interface FlightSearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string | null; // 🔥 AJOUTÉ
  currency?: string; // bonus
}

export interface FlightOffer {
  id: string;

  // Compagnie
  airlineName?: string;
  airlineCode?: string;
  airlineLogoUrl?: string;

  // Départ
  departureAirportCode?: string;
  departureAirportName?: string;
  departureCity?: string;
  departureTime?: string;

  // Arrivée
  arrivalAirportCode?: string;
  arrivalAirportName?: string;
  arrivalCity?: string;
  arrivalTime?: string;

  // Vol
  duration?: string;
  stops?: number;

  // Prix
  priceAmount?: number;
  priceCurrency?: string;

  // Coordonnées (pour la carte)
  departureLatitude?: number;
  departureLongitude?: number;
  arrivalLatitude?: number;
  arrivalLongitude?: number;

  // ✅ NOUVEAUX CHAMPS pour ALLER-RETOUR
  slices?: Array<{
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    stops: number;
    segments: Array<{
      origin: string;
      destination: string;
      departingAt: string;
      arrivingAt: string;
      duration: string;
      marketingCarrier?: string;
      operatingCarrier?: string;
      flightNumber?: string;
    }>;
  }>;

  // Champs retour (backward compat)
  returnOrigin?: string;
  returnDestination?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  returnDuration?: string;
  returnStops?: number;
  returnSegments?: Array<{
    origin: string;
    destination: string;
    departingAt: string;
    arrivingAt: string;
    duration: string;
    marketingCarrier?: string;
    operatingCarrier?: string;
    flightNumber?: string;
  }>;

  // Compat rétro
  airline?: string;
  origin?: string;
  destination?: string;
  departureTimeRaw?: string;
  arrivalTimeRaw?: string;
  durationMinutes?: number;
  price?: number;
  currency?: string;
  segments?: Array<{
    origin: string;
    destination: string;
    departingAt: string;
    arrivingAt: string;
    duration: string;
    marketingCarrier?: string;
    operatingCarrier?: string;
    flightNumber?: string;
  }>;
}

// Base URL du backend
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function searchFlights(
  params: FlightSearchParams
): Promise<FlightOffer[]> {
  // ✅ On nettoie returnDate si vide
  const cleanParams = {
    ...params,
    returnDate:
      params.returnDate && params.returnDate.trim() !== ""
        ? params.returnDate.trim()
        : undefined,
  };

  const response = await fetch(`${API_BASE_URL}/api/flights/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanParams),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Flight search failed");
  }

  const data = await response.json();

  const rawOffers =
    data.flights || data.offers || data.data?.offers || data.data || [];

  const offers: FlightOffer[] = rawOffers;

  return dedupeKeepCheapest(offers);
}