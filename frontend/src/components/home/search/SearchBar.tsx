import { useEffect, useState } from "react";
import { MdFlight, MdSwapHoriz } from "react-icons/md";
import AirportAutocomplete from "./AirportAutocomplete";
import type { Airport } from "../../../hooks/useAirportSearch";

type SearchValues = {
  from: string;
  to: string;
  date: string; // depart
  returnDate?: string | null; // retour (optionnel)
};

interface SearchBarProps {
  onSearch: (params: SearchValues) => void;
  isLoading?: boolean;

  // pour le drawer mobile
  variant?: "page" | "drawer";
  initialValues?: Partial<SearchValues>;
}

export default function SearchBar({
  onSearch,
  isLoading = false,
  variant = "page",
  initialValues,
}: SearchBarProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(""); // depart
  const [returnDate, setReturnDate] = useState(""); // retour
  const [error, setError] = useState<string | null>(null);
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);

  useEffect(() => {
    if (!initialValues) return;

    if (typeof initialValues.from === "string") setFrom(initialValues.from);
    if (typeof initialValues.to === "string") setTo(initialValues.to);
    if (typeof initialValues.date === "string") setDate(initialValues.date);

    if (typeof initialValues.returnDate === "string") setReturnDate(initialValues.returnDate);
    if (initialValues.returnDate === null) setReturnDate("");

    setError(null);
  }, [initialValues?.from, initialValues?.to, initialValues?.date, initialValues?.returnDate]);

  const handleSwap = () => {
    const tempCode = from;
    setFrom(to);
    setTo(tempCode);

    const tempAirport = fromAirport;
    setFromAirport(toAirport);
    setToAirport(tempAirport);
  };

  const handleFromChange = (code: string, airport?: Airport) => {
    setFrom(code);
    setFromAirport(airport || null);
  };

  const handleToChange = (code: string, airport?: Airport) => {
    setTo(code);
    setToAirport(airport || null);
  };

  const handleSearch = () => {
    if (!from || !to || !date) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (from.length !== 3 || to.length !== 3) {
      setError("Veuillez sélectionner un aéroport dans les suggestions");
      return;
    }

    // si retour avant départ => erreur
    if (returnDate && new Date(returnDate) < new Date(date)) {
      setError("La date de retour doit être après la date de départ");
      return;
    }

    setError(null);

    onSearch({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      date,
      returnDate: returnDate ? returnDate : null,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) handleSearch();
  };

  const wrapperClass =
    variant === "drawer"
      ? "bg-white px-6 pb-8 pt-5"
      : "bg-white py-8 border-b border-slate-200";

  const innerClass =
    variant === "drawer" ? "max-w-7xl mx-auto" : "max-w-7xl mx-auto px-4";

  return (
    <div className={wrapperClass}>
      <div className={innerClass}>
        {/* TITLE (page only) */}
        {variant === "page" && (
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              Voytica — Ready for takeoff
            </h1>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-800 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row items-center gap-3">
          {/* FROM */}
          <div className="w-full md:flex-1">
            <AirportAutocomplete
              value={from}
              onChange={handleFromChange}
              label="De"
              placeholder="Code ou ville"
              disabled={isLoading}
            />
          </div>

          {/* SWAP */}
          <button
            onClick={handleSwap}
            disabled={isLoading}
            className="md:mt-6 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
            title="Inverser"
            type="button"
          >
            <MdSwapHoriz className="text-lg" />
          </button>

          {/* TO */}
          <div className="w-full md:flex-1">
            <AirportAutocomplete
              value={to}
              onChange={handleToChange}
              label="Vers"
              placeholder="Code ou ville"
              disabled={isLoading}
            />
          </div>

          {/* DEPART DATE */}
          <div className="w-full md:flex-1">
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Aller
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm disabled:opacity-50"
            />
          </div>

          {/* RETURN DATE */}
          <div className="w-full md:flex-1">
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Retour
            </label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              min={date || new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm disabled:opacity-50"
            />
          </div>

          {/* SEARCH */}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition md:mt-6 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <MdFlight className="text-lg" />
            {isLoading ? "Recherche..." : "Rechercher"}
          </button>
        </div>
      </div>
    </div>
  );
}