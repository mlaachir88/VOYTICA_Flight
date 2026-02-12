import { Airport, IAirportAdapter } from "../services/airportService";
import airportsData from "../data/airports.json";

export class StaticAirportAdapter implements IAirportAdapter {
  private airports: Airport[] = airportsData.airports;

  async search(query: string): Promise<Airport[]> {
    if (!query || query.length < 1) {
      return [];
    }

    const q = query.toUpperCase().trim();

    // Chercher dans code, city, country, name
    const results = this.airports.filter((airport) =>
      airport.code.includes(q) ||
      airport.city.toUpperCase().includes(q) ||
      airport.country.toUpperCase().includes(q) ||
      airport.name.toUpperCase().includes(q)
    );

    // Limiter à 10 résultats
    return results.slice(0, 10);
  }

  async getByCode(code: string): Promise<Airport | null> {
    const airport = this.airports.find(
      (a) => a.code.toUpperCase() === code.toUpperCase()
    );
    return airport || null;
  }

  async getAll(): Promise<Airport[]> {
    return this.airports;
  }
}