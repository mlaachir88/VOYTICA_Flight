import type { FlightOffer } from "./api";

export function durationToMinutes(iso?: string): number {
  if (!iso) return 0;
  const h = /(\d+)H/.exec(iso)?.[1];
  const m = /(\d+)M/.exec(iso)?.[1];
  return (h ? parseInt(h, 10) : 0) * 60 + (m ? parseInt(m, 10) : 0);
}

function itineraryKeyFlat(o: FlightOffer) {
  const dep = o.departureAirportCode || o.origin || "";
  const arr = o.arrivalAirportCode || o.destination || "";
  const depTime = o.departureTime || o.departureTimeRaw || "";
  const arrTime = o.arrivalTime || o.arrivalTimeRaw || "";
  const stops = String(o.stops ?? "");
  const duration = o.duration || "";
  const airline = o.airlineCode || "";
  return `${airline}::${dep}-${arr}::${depTime}::${arrTime}::${stops}::${duration}`;
}

export function dedupeKeepCheapest(offers: FlightOffer[]) {
  const map = new Map<string, FlightOffer>();

  for (const o of offers) {
    const key = itineraryKeyFlat(o);
    const existing = map.get(key);

    const oPrice = o.priceAmount ?? o.price ?? Number.POSITIVE_INFINITY;
    const ePrice = existing
      ? existing.priceAmount ?? existing.price ?? Number.POSITIVE_INFINITY
      : Number.POSITIVE_INFINITY;

    if (!existing || oPrice < ePrice) {
      map.set(key, o);
    }
  }

  return [...map.values()].sort((a, b) => {
    const ap = a.priceAmount ?? a.price ?? Number.POSITIVE_INFINITY;
    const bp = b.priceAmount ?? b.price ?? Number.POSITIVE_INFINITY;
    return ap - bp;
  });
}