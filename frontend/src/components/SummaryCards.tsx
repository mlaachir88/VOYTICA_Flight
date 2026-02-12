import { useMemo } from "react";

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

interface SummaryCardsProps {
  flights: Flight[];
  onSelectSort?: (sortType: SortType) => void;
  selectedSortType?: SortType;
}

function parseDuration(durationStr: string): number {
  if (!durationStr) return 0;
  
  try {
    // Gère les formats :
    // PT3H9M → 3h 9m
    // P1DT1H25M → 1 jour + 1h 25m
    // PT35M → 35m
    
    let totalMinutes = 0;
    
    // Parse les jours (P[n]D)
    const dayMatch = durationStr.match(/P(\d+)D/);
    if (dayMatch) {
      totalMinutes += parseInt(dayMatch[1]) * 24 * 60;
    }
    
    // Parse les heures (T[n]H)
    const hourMatch = durationStr.match(/T(\d+)H/);
    if (hourMatch) {
      totalMinutes += parseInt(hourMatch[1]) * 60;
    }
    
    // Parse les minutes ([n]M)
    const minMatch = durationStr.match(/(\d+)M/);
    if (minMatch) {
      totalMinutes += parseInt(minMatch[1]);
    }
    
    return totalMinutes;
  } catch {
    return 0;
  }
}

function formatDurationShort(durationStr: string): string {
  if (!durationStr) return "—";
  
  try {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    
    // Parse les jours
    const dayMatch = durationStr.match(/P(\d+)D/);
    if (dayMatch) {
      days = parseInt(dayMatch[1]);
    }
    
    // Parse les heures
    const hourMatch = durationStr.match(/T(\d+)H/);
    if (hourMatch) {
      hours = parseInt(hourMatch[1]);
    }
    
    // Parse les minutes
    const minMatch = durationStr.match(/(\d+)M/);
    if (minMatch) {
      minutes = parseInt(minMatch[1]);
    }
    
    // Formate l'affichage
    const parts = [];
    if (days > 0) parts.push(`${days}j`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.length > 0 ? parts.join(" ") : "—";
  } catch {
    return "—";
  }
}

export default function SummaryCards({
  flights,
  onSelectSort,
  selectedSortType,
}: SummaryCardsProps) {
  const summary = useMemo(() => {
    if (flights.length === 0) {
      return { cheapest: null, fastest: null, bestValue: null };
    }

    const cheapest = flights.reduce((min, flight) =>
      flight.price < min.price ? flight : min
    );

    const fastest = flights.reduce((min, flight) => {
      const minDuration = parseDuration(min.duration);
      const flightDuration = parseDuration(flight.duration);
      return flightDuration < minDuration ? flight : min;
    });

    const bestValue = flights.reduce((best, flight) => {
      const flightScore = flight.price / (parseDuration(flight.duration) || 1);
      const bestScore = best.price / (parseDuration(best.duration) || 1);
      return flightScore < bestScore ? flight : best;
    });

    return { cheapest, fastest, bestValue };
  }, [flights]);

  if (flights.length === 0) {
    return null;
  }

  const cards = [
    {
      sortType: "bestValue" as SortType,
      label: "Le meilleur",
      flight: summary.bestValue,
      icon: "⭐",
      bgColor: "bg-white",
      textColor: "text-slate-900",
      borderColor: "border-slate-200",
      activeBgColor: "bg-blue-50",
      activeBorderColor: "border-blue-500",
    },
    {
      sortType: "cheapest" as SortType,
      label: "Le moins cher",
      flight: summary.cheapest,
      icon: "💰",
      bgColor: "bg-slate-900",
      textColor: "text-white",
      borderColor: "border-slate-800",
      activeBgColor: "bg-slate-700",
      activeBorderColor: "border-blue-400",
    },
    {
      sortType: "fastest" as SortType,
      label: "Le plus rapide",
      flight: summary.fastest,
      icon: "⚡",
      bgColor: "bg-white",
      textColor: "text-slate-900",
      borderColor: "border-slate-200",
      activeBgColor: "bg-blue-50",
      activeBorderColor: "border-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <button
          key={card.sortType}
          onClick={() => {
            if (selectedSortType === card.sortType) {
              onSelectSort?.(null);
            } else {
              onSelectSort?.(card.sortType);
            }
          }}
          className={`border-2 rounded-2xl p-6 text-left transition hover:shadow-lg cursor-pointer ${
            selectedSortType === card.sortType
              ? `${card.activeBgColor} ${card.activeBorderColor}`
              : `${card.bgColor} ${card.borderColor}`
          }`}
        >
          {/* LABEL */}
          <p className={`text-sm font-semibold ${card.textColor} opacity-70 mb-1`}>
            {card.label}
          </p>

          {/* PRIX EN GROS */}
          <div className="flex items-baseline gap-2 mb-2">
            <p className={`text-4xl font-black ${card.textColor}`}>
              {Math.round(card.flight?.price || 0)}
            </p>
            <p className={`text-sm font-semibold ${card.textColor}`}>€</p>
          </div>

          {/* DURÉE EN PETIT */}
          <p className={`text-xs ${card.textColor} opacity-60`}>
            {card.flight?.duration ? formatDurationShort(card.flight.duration) : "—"}
          </p>
        </button>
      ))}
    </div>
  );
}