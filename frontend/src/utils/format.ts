/**
 * src/utils/format.ts
 * Utilitaires de formatage pour les données de vols
 * FICHIER CRITIQUE - utilisé partout dans l'app
 */

export function formatTime(isoTime?: string): string {
  if (!isoTime) return "—";
  
  try {
    const date = new Date(isoTime);
    if (isNaN(date.getTime())) return "—";
    
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
}

export function formatDuration(duration?: string): string {
  if (!duration) return "—";
  
  try {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    
    if (!match) return "—";
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours === 0 && minutes === 0 && seconds === 0) return "—";
    
    const parts = [];
    
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    
    if (parts.length === 0 && seconds > 0) {
      return "1m";
    }
    
    return parts.join(" ");
  } catch {
    return "—";
  }
}

export function formatStops(stops?: number): string {
  if (stops === undefined || stops === null) return "—";
  
  if (stops === 0) {
    return "✈️ Direct";
  }
  
  if (stops === 1) {
    return "1 escale";
  }
  
  return `${stops} escales`;
}

export function formatPrice(amount?: number, currency?: string): string {
  if (amount === undefined || amount === null) return "Prix indisponible";
  
  const curr = currency || "EUR";
  
  try {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return formatted;
  } catch {
    return `${Math.round(amount)} ${curr}`;
  }
}

export function formatDate(isoDate?: string, format: "short" | "long" | "weekday" = "short"): string {
  if (!isoDate) return "—";
  
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "—";
    
    if (format === "short") {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    
    if (format === "long") {
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    
    if (format === "weekday") {
      return date.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    }
    
    return "—";
  } catch {
    return "—";
  }
}

export function formatAirport(code?: string, city?: string): string {
  if (!code) return "—";
  
  const codeFormatted = code.toUpperCase();
  
  if (!city) return codeFormatted;
  
  return `${codeFormatted} (${city})`;
}

export function formatLayover(departureTime?: string, arrivalTime?: string): string {
  if (!departureTime || !arrivalTime) return "—";
  
  try {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    
    if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) return "—";
    
    const diffMs = arrival.getTime() - departure.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 0) return "—";
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    }
    
    if (mins === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${mins}m`;
  } catch {
    return "—";
  }
}

export function daysUntil(isoDate?: string): string {
  if (!isoDate) return "—";
  
  try {
    const flightDate = new Date(isoDate);
    const today = new Date();
    
    flightDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffMs = flightDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays < 0) return "Passé";
    
    return `Dans ${diffDays} jours`;
  } catch {
    return "—";
  }
}

export function getPriceColor(price: number, minPrice: number, maxPrice: number): string {
  if (price <= minPrice * 1.1) return "green";
  if (price <= minPrice * 1.5) return "yellow";
  if (price <= minPrice * 2) return "orange";
  return "red";
}

export function formatPriceRange(minPrice: number, maxPrice: number, currency = "EUR"): string {
  const min = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(minPrice);
  
  const max = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(maxPrice);
  
  return `${min} - ${max}`;
}