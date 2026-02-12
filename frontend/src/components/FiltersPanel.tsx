import { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";

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

interface FilterState {
  priceMin: number | null;
  priceMax: number | null;
  maxStops: number | null;
  airlines: string[];
}

interface FiltersPanelProps {
  flights: Flight[];
  onFilterChange: (filters: FilterState) => void;

  // ✅ drawer
  variant?: "sidebar" | "drawer";
  onClose?: () => void;
}

export default function FiltersPanel({
  flights,
  onFilterChange,
  variant = "sidebar",
  onClose,
}: FiltersPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceMin: null,
    priceMax: null,
    maxStops: null,
    airlines: [],
  });

  const priceRange = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 0 };
    const prices = flights.map((f) => f.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [flights]);

  const uniqueAirlines = useMemo(() => {
    const airlines = new Map<string, string>();
    flights.forEach((flight) => {
      if (!airlines.has(flight.airline)) airlines.set(flight.airline, flight.logo || "");
    });
    return Array.from(airlines.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [flights]);

  const handleReset = () => {
    const empty: FilterState = {
      priceMin: null,
      priceMax: null,
      maxStops: null,
      airlines: [],
    };
    setFilters(empty);
    onFilterChange(empty);
  };

  const hasActiveFilters =
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.maxStops !== null ||
    filters.airlines.length > 0;

  const containerClass =
    variant === "drawer"
      ? "w-full bg-white p-6"
      : "w-full md:w-72 bg-white rounded-xl border border-slate-200 p-6 sticky top-24 h-fit";

  return (
    <div className={containerClass}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900">Filtres</h3>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              type="button"
            >
              Réinitialiser
            </button>
          )}

          {variant === "drawer" && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition"
              type="button"
              aria-label="Fermer"
            >
              <MdClose className="text-xl text-slate-700" />
            </button>
          )}
        </div>
      </div>

      {/* PRIX */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Prix (€)</h4>

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ""}
            onChange={(e) => {
              const v = e.target.value ? parseInt(e.target.value) : null;
              const next = { ...filters, priceMin: v };
              setFilters(next);
              onFilterChange(next);
            }}
            min={priceRange.min}
            max={priceRange.max}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ""}
            onChange={(e) => {
              const v = e.target.value ? parseInt(e.target.value) : null;
              const next = { ...filters, priceMax: v };
              setFilters(next);
              onFilterChange(next);
            }}
            min={priceRange.min}
            max={priceRange.max}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="text-xs text-slate-500">
          Gamme: €{priceRange.min} - €{priceRange.max}
        </p>
      </div>

      {/* ESCALES */}
      <div className="mb-6">
        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Escales</h4>

        <div className="space-y-2">
          {[
            { label: "Tous", value: null },
            { label: "Direct uniquement", value: 0 },
            { label: "Max 1 escale", value: 1 },
            { label: "Max 2 escales", value: 2 },
          ].map((opt) => (
            <label key={String(opt.value)} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="stops"
                checked={filters.maxStops === opt.value}
                onChange={() => {
                  const next = { ...filters, maxStops: opt.value };
                  setFilters(next);
                  onFilterChange(next);
                }}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* COMPAGNIES */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-3 text-sm">Compagnies</h4>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {uniqueAirlines.map(([airline, logo]) => (
            <label key={airline} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => {
                  const nextAirlines = filters.airlines.includes(airline)
                    ? filters.airlines.filter((a) => a !== airline)
                    : [...filters.airlines, airline];

                  const next = { ...filters, airlines: nextAirlines };
                  setFilters(next);
                  onFilterChange(next);
                }}
                className="w-4 h-4 cursor-pointer"
              />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {logo && (
                  <img
                    src={logo}
                    alt={airline}
                    className="w-5 h-5 rounded-full object-contain flex-shrink-0"
                  />
                )}
                <span className="text-sm text-slate-700 truncate">{airline}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}