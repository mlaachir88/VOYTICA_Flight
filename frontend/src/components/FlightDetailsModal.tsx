import { MdClose, MdFlight } from "react-icons/md";

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

  // outbound (old fields kept)
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  origin: string;
  destination: string;

  // outbound segments (one-way legacy)
  segments?: FlightSegment[];

  // round-trip new support
  slices?: FlightSlice[];
  returnSegments?: FlightSegment[];

  // (optional) if you keep these in response
  returnOrigin?: string;
  returnDestination?: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  returnDuration?: string;
  returnStops?: number;
}

interface FlightDetailsModalProps {
  flight: Flight | null;
  isOpen: boolean;
  onClose: () => void;
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
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
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

function formatStops(stops?: number): string {
  const s = stops ?? 0;
  if (s === 0) return "Direct";
  if (s === 1) return "1 escale";
  return `${s} escales`;
}

function minutesBetween(startIso?: string, endIso?: string): number | null {
  if (!startIso || !endIso) return null;
  const start = new Date(startIso);
  const end = new Date(endIso);
  const ms = end.getTime() - start.getTime();
  if (!Number.isFinite(ms)) return null;
  const mins = Math.round(ms / 60000);
  return mins >= 0 ? mins : null;
}

function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
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
  // Priority: slices[0] (round-trip) > segments (legacy) > fallback from main fields
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
  // Priority: slices[1] > returnSegments > return* fields > null (no return)
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

function SegmentTimeline({
  segments,
  airline,
}: {
  segments: FlightSegment[];
  airline: string;
}) {
  const hasStops = segments.length > 1;

  return (
    <div className="space-y-4">
      {segments.map((seg, idx) => {
        const next = segments[idx + 1];
        const layoverMins = next ? minutesBetween(seg.arrivingAt, next.departingAt) : null;

        const carrier = seg.marketingCarrier || seg.operatingCarrier || airline;

        const showOperatedBy =
          seg.operatingCarrier &&
          seg.marketingCarrier &&
          seg.operatingCarrier !== seg.marketingCarrier;

        return (
          <div key={`${seg.origin}-${seg.destination}-${idx}`}>
            {/* SEGMENT ROW */}
            <div className="flex gap-4">
              {/* TIMELINE DOT + LINE */}
              <div className="flex flex-col items-center pt-1">
                <div className="h-3 w-3 rounded-full bg-slate-900"></div>
                {idx < segments.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 mt-2"></div>
                )}
              </div>

              {/* CONTENT */}
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      {seg.origin} → {seg.destination}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {carrier}
                      {seg.flightNumber ? ` • ${seg.flightNumber}` : ""}
                    </p>
                    {showOperatedBy && (
                      <p className="text-xs text-slate-500 mt-1">
                        Opéré par {seg.operatingCarrier}
                      </p>
                    )}
                    {!hasStops ? null : (
                      <p className="text-[11px] text-slate-500 mt-1">
                        Segment {idx + 1}/{segments.length}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {formatTime(seg.departingAt)} – {formatTime(seg.arrivingAt)}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {formatDuration(seg.duration)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LAYOVER */}
            {next && (
              <div className="ml-7 mt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-700">
                  <span className="font-semibold">Escale à {seg.destination}</span>
                  <span className="text-slate-400">•</span>
                  <span>{layoverMins !== null ? formatMinutes(layoverMins) : "—"}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function FlightDetailsModal({
  flight,
  isOpen,
  onClose,
}: FlightDetailsModalProps) {
  if (!isOpen || !flight) return null;

  const outbound = normalizeOutbound(flight);
  const inbound = normalizeReturn(flight);

  const isRoundTrip = Boolean(inbound);

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
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
                  <p className="text-xs text-slate-500 mt-1">
                    {isRoundTrip ? "Aller-retour" : "Aller simple"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600 font-semibold">Type</p>
                <p className="text-lg font-bold text-slate-900">
                  {flight.id.substring(0, 6)}
                </p>
              </div>
            </div>

            {/* OUTBOUND MAIN ROUTE SECTION */}
            <div className="mb-8 pb-8 border-b-2 border-dashed border-slate-300">
              <p className="text-xs text-slate-600 font-semibold mb-3">ALLER</p>

              <div className="grid grid-cols-3 gap-4 items-end mb-6">
                {/* DEPARTURE */}
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-2">Départ</p>
                  <p className="text-5xl font-black text-slate-900 leading-tight">
                    {outbound.origin}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">{outbound.origin}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatTime(outbound.departureTime)}
                  </p>
                </div>

                {/* FLIGHT ROUTE */}
                <div className="text-center">
                  <div className="relative flex items-center justify-center mb-2">
                    <div className="w-full h-0.5 bg-slate-400 absolute"></div>
                    <div className="bg-white border-2 border-slate-900 rounded-full p-2 relative z-10">
                      <MdFlight className="text-slate-900 text-lg rotate-90" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-2">
                    {formatDuration(outbound.duration)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatStops(outbound.stops)}
                  </p>
                </div>

                {/* ARRIVAL */}
                <div className="text-right">
                  <p className="text-sm text-slate-600 font-semibold mb-2">Arrivée</p>
                  <p className="text-5xl font-black text-slate-900 leading-tight">
                    {outbound.destination}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">{outbound.destination}</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatTime(outbound.arrivalTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* OUTBOUND ITINERARY */}
            <div className="mb-8 pb-8 border-b-2 border-dashed border-slate-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-600 font-semibold">Itinéraire (Aller)</p>
                  <p className="text-lg font-black text-slate-900">
                    {outbound.segments.length > 1 ? "Avec escales" : "Vol direct"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600 font-semibold">Segments</p>
                  <p className="text-lg font-black text-slate-900">
                    {outbound.segments.length}
                  </p>
                </div>
              </div>

              <SegmentTimeline segments={outbound.segments} airline={flight.airline} />
            </div>

            {/* RETURN MAIN ROUTE + ITINERARY (if exists) */}
            {inbound && (
              <div className="mb-8 pb-8 border-b-2 border-dashed border-slate-300">
                <p className="text-xs text-slate-600 font-semibold mb-3">RETOUR</p>

                <div className="grid grid-cols-3 gap-4 items-end mb-6">
                  {/* DEPARTURE */}
                  <div>
                    <p className="text-sm text-slate-600 font-semibold mb-2">Départ</p>
                    <p className="text-5xl font-black text-slate-900 leading-tight">
                      {inbound.origin}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">{inbound.origin}</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {formatTime(inbound.departureTime)}
                    </p>
                  </div>

                  {/* FLIGHT ROUTE */}
                  <div className="text-center">
                    <div className="relative flex items-center justify-center mb-2">
                      <div className="w-full h-0.5 bg-slate-400 absolute"></div>
                      <div className="bg-white border-2 border-slate-900 rounded-full p-2 relative z-10">
                        <MdFlight className="text-slate-900 text-lg rotate-90" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold mt-2">
                      {formatDuration(inbound.duration)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatStops(inbound.stops)}
                    </p>
                  </div>

                  {/* ARRIVAL */}
                  <div className="text-right">
                    <p className="text-sm text-slate-600 font-semibold mb-2">Arrivée</p>
                    <p className="text-5xl font-black text-slate-900 leading-tight">
                      {inbound.destination}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">{inbound.destination}</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">
                      {formatTime(inbound.arrivalTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Itinéraire (Retour)</p>
                    <p className="text-lg font-black text-slate-900">
                      {inbound.segments.length > 1 ? "Avec escales" : "Vol direct"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-600 font-semibold">Segments</p>
                    <p className="text-lg font-black text-slate-900">
                      {inbound.segments.length}
                    </p>
                  </div>
                </div>

                <SegmentTimeline segments={inbound.segments} airline={flight.airline} />
              </div>
            )}

            {/* INFO GRID - 2x2 */}
            <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b-2 border-dashed border-slate-300">
              {/* ESCALES */}
              <div>
                <p className="text-xs text-slate-600 font-semibold mb-1">Escales (Aller)</p>
                <p className="text-3xl font-black text-slate-900">
                  {formatStops(outbound.stops)}
                </p>
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
                <p className="text-xs text-slate-600 font-semibold mb-1">
                  Durée totale (Aller)
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatDuration(outbound.duration)}
                </p>
              </div>

              {/* DATE */}
              <div className="text-right">
                <p className="text-xs text-slate-600 font-semibold mb-1">
                  Date (Aller)
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatDate(outbound.departureTime)}
                </p>
              </div>

              {/* RETURN extra info (optional) */}
              {inbound && (
                <>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold mb-1">
                      Durée totale (Retour)
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatDuration(inbound.duration)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-600 font-semibold mb-1">
                      Date (Retour)
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatDate(inbound.departureTime)}
                    </p>
                  </div>
                </>
              )}
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