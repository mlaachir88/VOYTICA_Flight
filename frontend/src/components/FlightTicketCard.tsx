import { MdFlight } from "react-icons/md";

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

  // outbound old fields
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  origin: string;
  destination: string;

  // legacy
  segments?: FlightSegment[];

  // round-trip support
  slices?: FlightSlice[];
  returnSegments?: FlightSegment[];

  // optional return fields (if your backend keeps them)
  returnOrigin?: string;
  returnDestination?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  returnDuration?: string;
  returnStops?: number;
}

interface FlightTicketCardProps {
  flight: Flight;
  onViewDetails: (flight: Flight) => void;
}

function formatTime(isoTime?: string): string {
  if (!isoTime) return "—";
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

function formatDate(isoTime?: string): string {
  if (!isoTime) return "—";
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

function formatDuration(duration?: string): string {
  if (!duration) return "—";

  try {
    let days = 0;
    let hours = 0;
    let minutes = 0;

    const dayMatch = duration.match(/P(\d+)D/);
    if (dayMatch) days = parseInt(dayMatch[1], 10);

    const hourMatch = duration.match(/T(\d+)H/);
    if (hourMatch) hours = parseInt(hourMatch[1], 10);

    const minMatch = duration.match(/(\d+)M/);
    if (minMatch) minutes = parseInt(minMatch[1], 10);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}j`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.length > 0 ? parts.join(" ") : "—";
  } catch {
    return "—";
  }
}

function formatStopsLabel(stops?: number): string {
  const s = stops ?? 0;
  if (s === 0) return "Direct";
  if (s === 1) return "1 escale";
  return `${s} escales`;
}

function minutesBetween(aIso?: string, bIso?: string): number | null {
  if (!aIso || !bIso) return null;
  try {
    const a = new Date(aIso).getTime();
    const b = new Date(bIso).getTime();
    if (Number.isNaN(a) || Number.isNaN(b)) return null;
    const diff = Math.round((b - a) / 60000);
    return diff >= 0 ? diff : null;
  } catch {
    return null;
  }
}

function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h <= 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

type LayoverInfo = { airport: string; minutes: number | null };

function getStopAirports(segments?: FlightSegment[]): string[] {
  if (!segments || segments.length <= 1) return [];
  const raw = segments.slice(0, -1).map((s) => s.destination);
  return Array.from(new Set(raw.filter(Boolean)));
}

function getLayovers(segments?: FlightSegment[]): LayoverInfo[] {
  if (!segments || segments.length <= 1) return [];
  const layovers: LayoverInfo[] = [];

  for (let i = 0; i < segments.length - 1; i++) {
    const current = segments[i];
    const next = segments[i + 1];
    const airport = current.destination;
    const mins = minutesBetween(current.arrivingAt, next.departingAt);
    layovers.push({ airport, minutes: mins });
  }

  return layovers.filter((l) => Boolean(l.airport));
}

function getViaText(stops: number, segments?: FlightSegment[]): string | null {
  const s = stops ?? 0;
  if (s <= 0) return null;

  const stopAirports = getStopAirports(segments);
  if (stopAirports.length === 0) return formatStopsLabel(s);

  if (stopAirports.length === 1) return `Via ${stopAirports[0]}`;
  return `Via ${stopAirports.slice(0, 2).join(", ")}${stopAirports.length > 2 ? "…" : ""}`;
}

function buildFallbackSegments(params: {
  origin: string;
  destination: string;
  departingAt: string;
  arrivingAt: string;
  duration: string;
  airline: string;
}): FlightSegment[] {
  return [
    {
      origin: params.origin,
      destination: params.destination,
      departingAt: params.departingAt,
      arrivingAt: params.arrivingAt,
      duration: params.duration,
      marketingCarrier: params.airline,
      operatingCarrier: params.airline,
      flightNumber: "",
    },
  ];
}

function normalizeOutbound(flight: Flight) {
  const slice = Array.isArray(flight.slices) && flight.slices.length > 0 ? flight.slices[0] : null;

  const origin = slice?.origin ?? flight.origin;
  const destination = slice?.destination ?? flight.destination;
  const departureTime = slice?.departureTime ?? flight.departureTime;
  const arrivalTime = slice?.arrivalTime ?? flight.arrivalTime;
  const duration = slice?.duration ?? flight.duration;
  const stops = slice?.stops ?? flight.stops;

  const segments =
    slice?.segments && slice.segments.length > 0
      ? slice.segments
      : Array.isArray(flight.segments) && flight.segments.length > 0
      ? flight.segments
      : buildFallbackSegments({
          origin,
          destination,
          departingAt: departureTime,
          arrivingAt: arrivalTime,
          duration,
          airline: flight.airline,
        });

  return { origin, destination, departureTime, arrivalTime, duration, stops, segments };
}

function normalizeReturn(flight: Flight) {
  const slice =
    Array.isArray(flight.slices) && flight.slices.length > 1 ? flight.slices[1] : null;

  const hasReturnSlice = Boolean(slice && slice.segments && slice.segments.length > 0);
  const hasReturnSegments = Array.isArray(flight.returnSegments) && flight.returnSegments.length > 0;
  const hasReturnFields = Boolean(flight.returnDepartureTime && flight.returnArrivalTime);

  if (!hasReturnSlice && !hasReturnSegments && !hasReturnFields) return null;

  const origin = slice?.origin ?? flight.returnOrigin ?? flight.destination;
  const destination = slice?.destination ?? flight.returnDestination ?? flight.origin;
  const departureTime = slice?.departureTime ?? flight.returnDepartureTime ?? "";
  const arrivalTime = slice?.arrivalTime ?? flight.returnArrivalTime ?? "";
  const duration = slice?.duration ?? flight.returnDuration ?? "";
  const stops = slice?.stops ?? flight.returnStops ?? (hasReturnSegments ? flight.returnSegments!.length - 1 : 0);

  const segments =
    slice?.segments && slice.segments.length > 0
      ? slice.segments
      : hasReturnSegments
      ? flight.returnSegments!
      : buildFallbackSegments({
          origin,
          destination,
          departingAt: departureTime || "",
          arrivingAt: arrivalTime || "",
          duration: duration || "",
          airline: flight.airline,
        });

  return { origin, destination, departureTime, arrivalTime, duration, stops, segments };
}

export default function FlightTicketCard({ flight, onViewDetails }: FlightTicketCardProps) {
  const outbound = normalizeOutbound(flight);
  const inbound = normalizeReturn(flight);

  const viaText = getViaText(outbound.stops, outbound.segments);
  const layovers = getLayovers(outbound.segments);

  return (
    <div
      onClick={() => onViewDetails(flight)}
      className="relative bg-white rounded-3xl border-2 border-slate-200 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition cursor-pointer"
    >
      <div className="md:flex">
        {/* LEFT SIDE */}
        <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r-2 border-dashed border-slate-300">
          {/* HEADER */}
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

                {/* round trip small note */}
                {inbound && (
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                    Aller-retour
                  </p>
                )}
              </div>
            </div>

            {/* petit badge escale */}
            {viaText && (
              <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                {viaText}
              </div>
            )}
          </div>

          {/* ROUTE */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              {/* DEPARTURE */}
              <div>
                <p className="text-sm text-slate-500 mb-2">Départ</p>
                <p className="text-4xl md:text-5xl font-black text-slate-900">
                  {outbound.origin}
                </p>
                <p className="text-xs text-slate-600 mt-1">{outbound.origin}</p>
              </div>

              {/* ICON + DURATION */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative w-full h-1 bg-slate-300 mb-2">
                  <div className="absolute left-1/2 transform -translate-x-1/2 -top-2">
                    <MdFlight className="text-2xl text-slate-900 transform rotate-90" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  {formatDuration(outbound.duration)}
                </p>

                {/* escale visible en mobile aussi */}
                {viaText && (
                  <p className="sm:hidden mt-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                    {viaText}
                  </p>
                )}
              </div>

              {/* ARRIVAL */}
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-2">Arrivée</p>
                <p className="text-4xl md:text-5xl font-black text-slate-900">
                  {outbound.destination}
                </p>
                <p className="text-xs text-slate-600 mt-1">{outbound.destination}</p>
              </div>
            </div>
          </div>

          {/* TIMES & STOPS */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-1">Départ</p>
              <p className="text-xl font-bold text-slate-900">
                {formatTime(outbound.departureTime)}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Escales</p>
              <p className="text-sm font-semibold text-slate-700">
                {formatStopsLabel(outbound.stops)}
              </p>

              {/* liste rapide des escales */}
              {outbound.stops > 0 && getStopAirports(outbound.segments).length > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  {getStopAirports(outbound.segments).join(", ")}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Arrivée</p>
              <p className="text-xl font-bold text-slate-900">
                {formatTime(outbound.arrivalTime)}
              </p>
            </div>
          </div>

          {/* RETURN quick summary */}
          {inbound && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-semibold mb-2">Retour</p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-slate-900">
                    {inbound.origin} → {inbound.destination}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {formatStopsLabel(inbound.stops)} • {formatDuration(inbound.duration)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {formatTime(inbound.departureTime)} – {formatTime(inbound.arrivalTime)}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {formatDate(inbound.departureTime)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LAYOVERS pills (OUTBOUND) */}
          {layovers.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 font-semibold mb-3">
                Détails des escales (Aller)
              </p>
              <div className="flex flex-wrap gap-2">
                {layovers.map((l, idx) => (
                  <div
                    key={`${l.airport}-${idx}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <span className="text-sm font-bold text-slate-900">{l.airport}</span>
                    <span className="text-xs font-semibold text-slate-600">
                      {l.minutes === null ? "—" : `${formatMinutes(l.minutes)} d'escale`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-40 bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-8 flex flex-col justify-between">
          {/* DATE */}
          <div className="text-center mb-6">
            <p className="text-xs text-slate-600 font-medium mb-2">Date</p>
            <p className="text-sm font-bold text-slate-900">
              {formatDate(outbound.departureTime)}
            </p>

            {/* if round trip show return date too */}
            {inbound && (
              <p className="text-[11px] text-slate-600 mt-2 font-semibold">
                Retour: {formatDate(inbound.departureTime)}
              </p>
            )}
          </div>

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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(flight);
            }}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
          >
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