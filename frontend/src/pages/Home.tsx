import { useState } from "react";
import SearchResults from "../components/results/search-results";
import { TopDestinations, NewsletterSection } from "../components/home/sections";
import { SearchBar } from "../components/home/search";
import Header from "../components/layout/header";

type FlightSegment = {
  origin: string;
  destination: string;
  departingAt: string;
  arrivingAt: string;
  duration: string;
  marketingCarrier?: string;
  operatingCarrier?: string;
  flightNumber?: string;
};

type FlightSlice = {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  segments: FlightSegment[];
};

interface Flight {
  id: string;
  airline: string;
  logo?: string;
  price: number;
  currency: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  origin: string;
  destination: string;
  segments?: FlightSegment[];

  // ✅ ALLER-RETOUR SUPPORT
  slices?: FlightSlice[];
  returnOrigin?: string;
  returnDestination?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  returnDuration?: string;
  returnStops?: number;
  returnSegments?: FlightSegment[];
}

interface SearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string | null;
}

type BackendSegment = {
  origin?: string;
  destination?: string;
  departingAt?: string;
  arrivingAt?: string;
  duration?: string;
  marketingCarrier?: string;
  operatingCarrier?: string;
  flightNumber?: string;
};

type BackendSlice = {
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  stops?: number;
  segments?: BackendSegment[];
};

type BackendFlight = {
  id: string;

  // format "propre"
  airlineName?: string;
  airlineLogoUrl?: string;
  priceAmount?: number;
  priceCurrency?: string;
  departureAirportCode?: string;
  arrivalAirportCode?: string;

  // format "simple"
  airline?: string;
  logo?: string;
  price?: number;
  currency?: string;
  origin?: string;
  destination?: string;

  // commun
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  stops?: number;

  // segments
  segments?: BackendSegment[];

  // ✅ ALLER-RETOUR
  slices?: BackendSlice[];
  returnOrigin?: string;
  returnDestination?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  returnDuration?: string;
  returnStops?: number;
  returnSegments?: BackendSegment[];
};

type FlightsApiResponse = {
  flights?: BackendFlight[];
  offers?: BackendFlight[];
  data?: any;
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "Une erreur s'est produite";
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isSegmentsArray(v: unknown): v is BackendSegment[] {
  return Array.isArray(v);
}

function toSegment(s: BackendSegment): FlightSegment | null {
  const origin = s.origin ?? "";
  const destination = s.destination ?? "";
  const departingAt = s.departingAt ?? "";
  const arrivingAt = s.arrivingAt ?? "";
  const duration = s.duration ?? "";

  if (
    !isNonEmptyString(origin) ||
    !isNonEmptyString(destination) ||
    !isNonEmptyString(departingAt) ||
    !isNonEmptyString(arrivingAt)
  ) {
    return null;
  }

  return {
    origin,
    destination,
    departingAt,
    arrivingAt,
    duration,
    marketingCarrier: s.marketingCarrier,
    operatingCarrier: s.operatingCarrier,
    flightNumber: s.flightNumber,
  };
}

function toSlice(s: BackendSlice): FlightSlice | null {
  if (!s || !s.origin || !s.destination) return null;

  const segments = isSegmentsArray(s.segments)
    ? s.segments.map(toSegment).filter(Boolean) as FlightSegment[]
    : [];

  return {
    origin: s.origin,
    destination: s.destination,
    departureTime: s.departureTime || "",
    arrivalTime: s.arrivalTime || "",
    duration: s.duration || "",
    stops: s.stops ?? 0,
    segments,
  };
}

function normalizeFlight(raw: BackendFlight): Flight {
  const segments = isSegmentsArray(raw.segments)
    ? raw.segments.map(toSegment).filter(Boolean) as FlightSegment[]
    : undefined;

  const returnSegments = isSegmentsArray(raw.returnSegments)
    ? raw.returnSegments.map(toSegment).filter(Boolean) as FlightSegment[]
    : undefined;

  const slices = Array.isArray(raw.slices)
    ? raw.slices.map(toSlice).filter(Boolean) as FlightSlice[]
    : undefined;

  const origin = raw.departureAirportCode || raw.origin || "";
  const destination = raw.arrivalAirportCode || raw.destination || "";
  const departureTime = raw.departureTime || "";
  const arrivalTime = raw.arrivalTime || "";
  const airline = raw.airlineName || raw.airline || "Unknown";
  const logo = raw.airlineLogoUrl || raw.logo;
  const currency = raw.priceCurrency || raw.currency || "EUR";

  const price =
    typeof raw.priceAmount === "number"
      ? raw.priceAmount
      : typeof raw.price === "number"
      ? raw.price
      : 0;

  const duration = raw.duration || "";

  const stops =
    typeof raw.stops === "number"
      ? raw.stops
      : segments && segments.length > 0
      ? Math.max(segments.length - 1, 0)
      : 0;

  return {
    id: raw.id,
    airline,
    logo,
    price,
    currency,
    departureTime,
    arrivalTime,
    duration,
    stops,
    origin,
    destination,
    segments: segments && segments.length > 0 ? segments : undefined,

    // ✅ ALLER-RETOUR
    slices: slices && slices.length > 0 ? slices : undefined,
    returnOrigin: raw.returnOrigin,
    returnDestination: raw.returnDestination,
    returnDepartureTime: raw.returnDepartureTime,
    returnArrivalTime: raw.returnArrivalTime,
    returnDuration: raw.returnDuration,
    returnStops: raw.returnStops,
    returnSegments: returnSegments && returnSegments.length > 0 ? returnSegments : undefined,
  };
}

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setSearchParams(params);
    setFlights([]);

    try {
      const response = await fetch("http://localhost:5000/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: params.from,
          to: params.to,
          date: params.date,
          returnDate: params.returnDate ?? null,
          currency: "EUR",
        }),
      });

      if (!response.ok) {
        let msg = "Erreur lors de la recherche";
        try {
          const e = await response.json();
          msg = e?.error || e?.message || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const data: FlightsApiResponse = await response.json();

      const rawFlights: BackendFlight[] =
        data.flights ||
        data.offers ||
        data.data?.flights ||
        data.data?.offers ||
        (Array.isArray(data.data) ? data.data : []) ||
        [];

      const transformedFlights: Flight[] = rawFlights.map(normalizeFlight);

      setFlights(transformedFlights);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div id="search">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {searchParams && (
        <SearchResults
          flights={flights}
          isLoading={isLoading}
          error={error}
          searchParams={searchParams}
          onSearch={handleSearch}
        />
      )}

      {!searchParams && (
        <main className="max-w-7xl mx-auto px-4 py-14">
          <TopDestinations
            onPick={(params) => handleSearch(params)}
            fromDefault="CDG"
          />
        </main>
      )}

      <NewsletterSection />
    </div>
  );
}