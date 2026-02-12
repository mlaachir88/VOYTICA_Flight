import { Airport, IAirportAdapter } from "../services/airportService";

export class DuffelAirportAdapter implements IAirportAdapter {
  // À IMPLÉMENTER PLUS TARD quand tu veux utiliser l'API
  
  async search(query: string): Promise<Airport[]> {
    try {
      const response = await fetch("/api/airports/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to search airports");
      }

      const data = await response.json();
      return data.airports || [];
    } catch (error) {
      console.error("Error searching airports:", error);
      return [];
    }
  }

  async getByCode(code: string): Promise<Airport | null> {
    try {
      const response = await fetch(`/api/airports/${code.toUpperCase()}`);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching airport:", error);
      return null;
    }
  }

  async getAll(): Promise<Airport[]> {
    try {
      const response = await fetch("/api/airports");

      if (!response.ok) {
        throw new Error("Failed to fetch airports");
      }

      const data = await response.json();
      return data.airports || [];
    } catch (error) {
      console.error("Error fetching airports:", error);
      return [];
    }
  }
}