import { useEffect, useState } from "react";
import { fetchAllZodiacs } from "../services/api";
import type { ZodiacEntry } from "../types";

export function useZodiacs() {
  const [zodiacs, setZodiacs] = useState<ZodiacEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAllZodiacs()
      .then((data) => { if (!cancelled) setZodiacs(data); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { zodiacs, loading, error };
}
