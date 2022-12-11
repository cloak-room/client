import { useEffect, useState } from "react";

export default function useData<T>(getData: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getData()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setData(null);
        setLoading(false);
        setError(err);
      });
  }, [getData]);

  return { data, loading, error };
}
