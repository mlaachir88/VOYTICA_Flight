//a garder frontend/src/components/FlightDetailsModal.tsx

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

interface FlightDetailsModalProps {
  flight: Flight | null;
  isOpen: boolean;
  onClose: () => void;
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

function formatDate(isoTime: string): string {
  try {
    const date = new Date(isoTime);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
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

export default function FlightDetailsModal({
  flight,
  isOpen,
  onClose,
}: FlightDetailsModalProps) {
  if (!isOpen || !flight) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
          
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-slate-900 hover:bg-slate-800 text-white rounded-full p-2 transition"
          >
            <MdClose className="text-2xl" />
          </button>

          {/* BOARDING PASS STYLE */}
          <div className="bg-white p-8">
            {/* HEADER */}
            <div className="flex items-start justify-between pb-6 border-b-2 border-slate-200 mb-6">
              <div className="flex items-center gap-4">
                {flight.logo ? (
                  <img
                    src={flight.logo}
                    alt={flight.airline}
                    className="h-12 w-12 rounded-full object-contain"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {flight.airline.substring(0, 2)}
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-600 font-semibold">Airlines</p>
                  <p className="text-2xl font-black text-slate-900">{flight.airline}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600 font-semibold">Type</p>
                <p className="text-lg font-bold text-slate-900">{flight.id.substring(0, 6)}</p>
              </div>
            </div>

            {/* MAIN ROUTE SECTION */}
            <div className="mb-8 pb-8 border-b-2 border-dashed border-slate-300">
              <div className="grid grid-cols-3 gap-4 items-end mb-6">
                {/* DEPARTURE */}
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-2">Départ</p>
                  <p className="text-5xl font-black text-slate-900 leading-tight">
                    {flight.origin}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">{flight.origin}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatTime(flight.departureTime)}
                  </p>
                </div>

                {/* FLIGHT ROUTE */}
                <div className="text-center">
                  <div className="relative flex items-center justify-center mb-2">
                    <div className="w-full h-0.5 bg-slate-400 absolute"></div>
                    <div className="bg-white border-2 border-slate-900 rounded-full p-2 relative z-10">
                      <div className="text-slate-900 text-lg">✈️</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-2">
                    {formatDuration(flight.duration)}
                  </p>
                </div>

                {/* ARRIVAL */}
                <div className="text-right">
                  <p className="text-sm text-slate-600 font-semibold mb-2">Arrivée</p>
                  <p className="text-5xl font-black text-slate-900 leading-tight">
                    {flight.destination}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">{flight.destination}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatTime(flight.arrivalTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* INFO GRID - 2x3 */}
            <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b-2 border-dashed border-slate-300">
              {/* ESCALES */}
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">Escales</p>
                <p className="text-3xl font-black text-slate-900">{formatStops(flight.stops)}</p>
              </div>

              {/* PRIX */}
              <div className="text-right">
                <p className="text-xs text-slate-600 font-semibold mb-1">Prix</p>
                <p className="text-3xl font-black text-slate-900">
                  {Math.round(flight.price)} {flight.currency}
                </p>
              </div>

              {/* DURÉE */}
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">Durée totale</p>
                <p className="text-2xl font-bold text-slate-900">{formatDuration(flight.duration)}</p>
              </div>

              {/* DATE */}
              <div className="text-right">
                <p className="text-xs text-slate-600 font-semibold mb-1">Date</p>
                <p className="text-2xl font-bold text-slate-900">{formatDate(flight.departureTime)}</p>
              </div>
            </div>

            {/* PASSENGER SECTION */}
            <div className="text-center mb-8">
              <p className="text-xs text-slate-600 font-semibold mb-2">Passager</p>
              <p className="text-2xl font-black text-slate-900">1 adulte</p>
            </div>

            {/* BOOKING BUTTON */}
            <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-xl transition">
              RÉSERVER MAINTENANT
            </button>

            <p className="text-xs text-slate-600 text-center mt-4">
              Vous serez redirigé vers notre partenaire pour finaliser la réservation
            </p>
          </div>
        </div>
      </div>
    </>
  );
}