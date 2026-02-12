import { useMemo, useState } from "react";
import { MdClose, MdTune } from "react-icons/md";
import SummaryCards from "../../SummaryCards";
import FiltersPanel from "../../FiltersPanel";
import FlightDetailsModal from "../../FlightDetailsModal";
import FlightTicketCard from "../../FlightTicketCard";
import { SearchBar } from "../../home/search";

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

type SortType = null | "cheapest" | "fastest" | "bestValue";

interface FilterState {
  priceMin: number | null;
  priceMax: number | null;
  maxStops: number | null;
  airlines: string[];
}

interface SearchResultsProps {
  flights: Flight[];
  isLoading: boolean;
  error: string | null;
  searchParams: { from: string; to: string; date: string } | null;
  onSearch: (params: { from: string; to: string; date: string }) => void;
}

function parseDuration(durationStr: string): number {
  if (!durationStr) return 0;
  try {
    let totalMinutes = 0;
    const dayMatch = durationStr.match(/P(\d+)D/);
    if (dayMatch) totalMinutes += parseInt(dayMatch[1]) * 24 * 60;
    const hourMatch = durationStr.match(/T(\d+)H/);
    if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
    const minMatch = durationStr.match(/(\d+)M/);
    if (minMatch) totalMinutes += parseInt(minMatch[1]);
    return totalMinutes;
  } catch {
    return 0;
  }
}

export default function SearchResults({
  flights,
  isLoading,
  error,
  searchParams,
  onSearch,
}: SearchResultsProps) {
  const [sortType, setSortType] = useState<SortType>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceMin: null,
    priceMax: null,
    maxStops: null,
    airlines: [],
  });

  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const hasActiveFilters =
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.maxStops !== null ||
    filters.airlines.length > 0 ||
    sortType !== null;

  const filteredFlights = useMemo(() => {
    return flights.filter((flight) => {
      if (filters.priceMin !== null && flight.price < filters.priceMin) return false;
      if (filters.priceMax !== null && flight.price > filters.priceMax) return false;
      if (filters.maxStops !== null && flight.stops > filters.maxStops) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
        return false;
      }
      return true;
    });
  }, [flights, filters]);

  const sortedFlights = useMemo(() => {
    if (!sortType) return filteredFlights;
    const flightsCopy = [...filteredFlights];

    if (sortType === "cheapest") return flightsCopy.sort((a, b) => a.price - b.price);
    if (sortType === "fastest") {
      return flightsCopy.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    }
    if (sortType === "bestValue") {
      return flightsCopy.sort((a, b) => {
        const aScore = a.price / (parseDuration(a.duration) || 1);
        const bScore = b.price / (parseDuration(b.duration) || 1);
        return aScore - bScore;
      });
    }
    return flightsCopy;
  }, [filteredFlights, sortType]);

  if (!searchParams) return null;

  const getSortLabel = (): string => {
    switch (sortType) {
      case "cheapest":
        return "Filtré par: Le moins cher";
      case "fastest":
        return "Filtré par: Le plus rapide";
      case "bestValue":
        return "Filtré par: Le meilleur";
      default:
        return "";
    }
  };

  const handleOpenModal = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  const dateLabel = new Date(searchParams.date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="mb-8 hidden md:block">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {searchParams.from} → {searchParams.to}
          </h3>
          <p className="text-slate-600 text-sm">
            {new Date(searchParams.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-slate-100 border border-slate-200 rounded-2xl p-8 h-32"
              />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-xl p-6 text-center">
            <p className="font-bold text-lg mb-2">Erreur lors de la recherche</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && flights.length === 0 && (
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">✈️</div>
            <p className="font-bold text-lg text-slate-900 mb-2">Aucun vol trouvé</p>
            <p className="text-slate-600">Essayez une autre date ou un autre aéroport</p>
          </div>
        )}

        {!isLoading && !error && flights.length > 0 && (
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              <SummaryCards
                flights={flights}
                selectedSortType={sortType}
                onSelectSort={setSortType}
              />

              {sortType && (
                <div className="mb-6 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <p className="text-sm font-semibold text-blue-900">{getSortLabel()}</p>
                  <button
                    onClick={() => setSortType(null)}
                    className="text-blue-600 hover:text-blue-900 transition"
                    type="button"
                  >
                    <MdClose className="text-lg" />
                  </button>
                </div>
              )}

              <p className="text-slate-600 font-medium text-sm mb-6">
                {sortedFlights.length} vol{sortedFlights.length !== 1 ? "s" : ""} disponible
                {sortedFlights.length !== 1 ? "s" : ""}
                {filteredFlights.length < flights.length && (
                  <span className="text-slate-500"> (filtrés de {flights.length})</span>
                )}
              </p>

              {sortedFlights.length === 0 && filteredFlights.length === 0 && (
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-12 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="font-bold text-lg text-slate-900 mb-2">Aucun vol ne correspond</p>
                  <p className="text-slate-600">Ajustez vos filtres et essayez de nouveau</p>
                </div>
              )}

              {sortedFlights.length > 0 && (
                <div className="space-y-4">
                  {sortedFlights.map((flight) => (
                    <FlightTicketCard
                      key={flight.id}
                      flight={flight}
                      onViewDetails={handleOpenModal}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:block w-72 flex-shrink-0">
              <FiltersPanel flights={flights} onFilterChange={setFilters} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 text-left rounded-2xl border border-slate-200 px-4 py-2 hover:bg-slate-50 transition"
          >
            <div className="text-sm font-semibold text-slate-900">
              {searchParams.from} → {searchParams.to}
            </div>
            <div className="text-xs text-slate-500">
              {dateLabel} • 1 passager
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsFiltersOpen(true)}
            className="relative w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition"
            aria-label="Filtres"
          >
            <MdTune className="text-xl text-slate-800" />
            {hasActiveFilters && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer: Search */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 pt-6">
              <h3 className="font-bold text-lg text-slate-900">Modifier la recherche</h3>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 transition"
                aria-label="Fermer"
              >
                <MdClose className="text-xl text-slate-700" />
              </button>
            </div>

            <SearchBar
              variant="drawer"
              isLoading={isLoading}
              initialValues={searchParams}
              onSearch={(p) => {
                setIsSearchOpen(false);
                onSearch(p);
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile drawer: Filters */}
      {isFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <FiltersPanel
              flights={flights}
              onFilterChange={setFilters}
              variant="drawer"
              onClose={() => setIsFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      <FlightDetailsModal
        flight={selectedFlight}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}