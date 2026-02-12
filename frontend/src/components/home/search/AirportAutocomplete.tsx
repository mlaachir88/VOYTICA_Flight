import { useState, useRef, useEffect } from "react";
import { MdFlight, MdClose } from "react-icons/md";
import { useAirportSearch } from "../../../hooks/useAirportSearch";
import type { Airport } from "../../../hooks/useAirportSearch";

interface AirportAutocompleteProps {
  value: string;
  onChange: (code: string, airport?: Airport) => void;
  placeholder?: string;
  label: string;
  disabled?: boolean;
}

export default function AirportAutocomplete({
  value,
  onChange,
  placeholder = "Code ou ville",
  label,
  disabled = false,
}: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { airports, isLoading } = useAirportSearch(showDropdown ? inputValue : "", 250);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowDropdown(true);
    setSelectedIndex(-1);
    if (!newValue) {
      onChange("");
    }
  };

  const handleSelectAirport = (airport: Airport) => {
    setInputValue(airport.code);
    onChange(airport.code, airport);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || airports.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < airports.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < airports.length) {
          handleSelectAirport(airports[selectedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (inputValue && airports.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-xs font-semibold text-slate-600 block mb-1">
        {label}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          disabled={disabled}
          className="w-full px-3 py-2 pr-20 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm disabled:opacity-50"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
          
          {inputValue && !disabled && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-slate-100 rounded-full transition"
              type="button"
            >
              <MdClose className="text-slate-400 text-sm" />
            </button>
          )}
          
          <MdFlight className="text-slate-400 text-lg" />
        </div>
      </div>

      {showDropdown && airports.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {airports.map((airport, index) => (
            <button
              key={airport.code}
              type="button"
              onClick={() => handleSelectAirport(airport)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-start gap-3 border-b border-slate-100 last:border-b-0 ${index === selectedIndex ? "bg-blue-50" : ""}`}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdFlight className="text-blue-600 text-xl" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-sm">
                  {airport.city}
                  <span className="ml-2 text-xs font-normal text-slate-500">({airport.code})</span>
                </div>
                <div className="text-xs text-slate-600 truncate">{airport.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{airport.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && !isLoading && inputValue && airports.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 text-center text-sm text-slate-500">
          Aucun aéroport trouvé pour &quot;{inputValue}&quot;
        </div>
      )}
    </div>
  );
}