import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE_URL } from "../lib/api";

export type Airport = {
  code: string;
  name: string;
  city: string;
  country: string;
  iata: string;
  region: string;
};

export function useAirportSearch(query: string, debounceMs: number = 300) {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);

  const searchAirports = useCallback(async (searchQuery: string) => {
    const q = searchQuery.trim();

    if (q.length === 0) {
      controllerRef.current?.abort();
      controllerRef.current = null;
      setAirports([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    // ✅ annule l'ancienne requête si elle existe
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/airports/search?q=${encodeURIComponent(q)}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data: Airport[] = await response.json();
      setAirports(data);
    } catch (err: unknown) {
      // ✅ si on a abort, on ignore (c'est normal)
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      let message = "Une erreur est survenue";
      if (err instanceof Error) message = err.message;
      else if (typeof err === "string") message = err;

      setError(message);
      setAirports([]);
    } finally {
      // ✅ évite de mettre isLoading=false si une autre requête a déjà démarré
      if (controllerRef.current === controller) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      searchAirports(query);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [query, debounceMs, searchAirports]);

  // ✅ cleanup à l'unmount
  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  return { airports, isLoading, error };
}