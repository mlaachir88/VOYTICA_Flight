import { useState } from "react";
import SearchResults from "../components/results/search-results";
import { TopDestinations, NewsletterSection } from "../components/home/sections";
import { SearchBar } from "../components/home/search";
import Header from "../components/layout/header";

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
}

interface SearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string | null; // ✅ ajouté
}

type BackendFlight = {
  id: string;
  airlineName?: string;
  airlineLogoUrl?: string;
  priceAmount?: number;
  priceCurrency?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops?: number;
  departureAirportCode: string;
  arrivalAirportCode: string;
};

type FlightsApiResponse = {
  flights?: BackendFlight[];
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "Une erreur s'est produite";
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
          returnDate: params.returnDate ?? null, // ✅ ajouté
          currency: "EUR",
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data: FlightsApiResponse = await response.json();

      const transformedFlights: Flight[] = (data.flights ?? []).map((flight) => ({
        id: flight.id,
        airline: flight.airlineName || "Unknown",
        logo: flight.airlineLogoUrl,
        price: flight.priceAmount || 0,
        currency: flight.priceCurrency || "EUR",
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        duration: flight.duration,
        stops: flight.stops ?? 0,
        origin: flight.departureAirportCode,
        destination: flight.arrivalAirportCode,
      }));

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
          <TopDestinations onPick={(params) => handleSearch(params)} fromDefault="CDG" />
        </main>
      )}

      <NewsletterSection />
    </div>
  );
}