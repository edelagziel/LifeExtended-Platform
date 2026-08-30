import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// הגדרת הממשק של מה שה-Hook מחזיר
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// T = הסוג של המידע שאנחנו מצפים לקבל (דיפולטיבי ל-any אם לא מגדירים)
export function useFetch<T = any>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // מתחיל ב-true
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // אם אין URL, אל תעשה כלום (מונע קריאות מיותרות)
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // התיקון הקריטי: משתמשים ב-URL בדיוק כמו שהוא
        const response = await axios.get<T>(url);
        setData(response.data);
      } catch (err: any) {
        // טיפול בשגיאות בצורה בטוחה ב-TS
        const errorMessage = axios.isAxiosError(err) 
          ? err.message 
          : "Something went wrong";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [url, trigger]);

  return { data, loading, error, refetch };
}

export default useFetch;