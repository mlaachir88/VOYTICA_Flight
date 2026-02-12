// Interface générique pour n'importe quel adapter (list ou API)
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  region: string;
}

export interface IAirportAdapter {
  search(query: string): Promise<Airport[]>;
  getByCode(code: string): Promise<Airport | null>;
  getAll(): Promise<Airport[]>;
}

export class AirportService {
  constructor(private adapter: IAirportAdapter) {}

  async search(query: string): Promise<Airport[]> {
    if (!query || query.length < 1) {
      return [];
    }
    return this.adapter.search(query);
  }

  async getByCode(code: string): Promise<Airport | null> {
    if (!code) return null;
    return this.adapter.getByCode(code.toUpperCase());
  }

  async getAll(): Promise<Airport[]> {
    return this.adapter.getAll();
  }
}