import { useEffect, useState } from "react";

export default function useData(getData: () => Promise<any[]>) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getData()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setData([]);
        setLoading(false);
        setError(err);
      });
  }, [getData]);

  return { data, loading, error };
}
