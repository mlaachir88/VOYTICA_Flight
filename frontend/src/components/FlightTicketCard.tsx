import { MdFlight } from "react-icons/md";

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

interface FlightTicketCardProps {
  flight: Flight;
  onViewDetails: (flight: Flight) => void;
}

function formatTime(isoTime: string): string {
  try {
    const date = new Date(isoTime);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
}

function formatDuration(duration: string): string {
  if (!duration) return "—";
  
  try {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    
    const dayMatch = duration.match(/P(\d+)D/);
    if (dayMatch) {
      days = parseInt(dayMatch[1]);
    }
    
    const hourMatch = duration.match(/T(\d+)H/);
    if (hourMatch) {
      hours = parseInt(hourMatch[1]);
    }
    
    const minMatch = duration.match(/(\d+)M/);
    if (minMatch) {
      minutes = parseInt(minMatch[1]);
    }
    
    const parts = [];
    if (days > 0) parts.push(`${days}j`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.length > 0 ? parts.join(" ") : "—";
  } catch {
    return "—";
  }
}

function formatStops(stops: number): string {
  if (stops === 0) return "Direct";
  if (stops === 1) return "1 escale";
  return `${stops} escales`;
}

function formatDate(isoTime: string): string {
  try {
    const date = new Date(isoTime);
    return date.toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function FlightTicketCard({
  flight,
  onViewDetails,
}: FlightTicketCardProps) {
  return (
    <div
      onClick={() => onViewDetails(flight)}
      className="relative bg-white rounded-3xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition cursor-pointer"
    >
      {/* TICKET CONTAINER */}
      <div className="md:flex">
        {/* LEFT SIDE - MAIN INFO */}
        <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r-2 border-dashed border-slate-300">
          {/* HEADER - AIRLINE */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {flight.logo ? (
                <img
                  src={flight.logo}
                  alt={flight.airline}
                  className="h-10 w-10 rounded-full object-contain"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {flight.airline.substring(0, 2)}
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 font-medium">Airlines</p>
                <p className="text-lg font-bold text-slate-900">{flight.airline}</p>
              </div>
            </div>
          </div>

          {/* ROUTE - BIG */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4">
              {/* DEPARTURE */}
              <div>
                <p className="text-sm text-slate-500 mb-2">Départ</p>
                <p className="text-4xl md:text-5xl font-black text-slate-900">
                  {flight.origin}
                </p>
                <p className="text-xs text-slate-600 mt-1">{flight.origin}</p>
              </div>

              {/* FLIGHT ICON */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative w-full h-1 bg-slate-300 mb-2">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-2">
                    <MdFlight className="text-2xl text-slate-900 transform rotate-90" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  {formatDuration(flight.duration)}
                </p>
              </div>

              {/* ARRIVAL */}
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-2">Arrivée</p>
                <p className="text-4xl md:text-5xl font-black text-slate-900">
                  {flight.destination}
                </p>
                <p className="text-xs text-slate-600 mt-1">{flight.destination}</p>
              </div>
            </div>
          </div>

          {/* TIMES & STOPS */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-1">Départ</p>
              <p className="text-xl font-bold text-slate-900">
                {formatTime(flight.departureTime)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Escales</p>
              <p className="text-sm font-semibold text-slate-700">
                {formatStops(flight.stops)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Arrivée</p>
              <p className="text-xl font-bold text-slate-900">
                {formatTime(flight.arrivalTime)}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - DATE & PRICE */}
        <div className="w-full md:w-40 bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-8 flex flex-col justify-between">
          {/* DATE */}
          <div className="text-center mb-6">
            <p className="text-xs text-slate-600 font-medium mb-2">📅 Date</p>
            <p className="text-sm font-bold text-slate-900">
              {formatDate(flight.departureTime)}
            </p>
          </div>

          {/* DIVIDER */}
          <div className="hidden md:block border-t-2 border-dashed border-blue-200 my-4"></div>

          {/* PRICE */}
          <div className="text-center">
            <p className="text-xs text-slate-600 font-medium mb-2">Prix</p>
            <p className="text-4xl font-black text-blue-600">
              {Math.round(flight.price)}
            </p>
            <p className="text-xs text-slate-600 font-semibold">
              {flight.currency} /pax
            </p>
          </div>

          {/* BUTTON */}
          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm">
            Voir détails
          </button>
        </div>
      </div>

      {/* DECORATIVE CIRCLES */}
      <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-slate-100 rounded-full border-2 border-dashed border-slate-300"></div>
      <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-slate-100 rounded-full border-2 border-dashed border-slate-300"></div>
    </div>
  );
}