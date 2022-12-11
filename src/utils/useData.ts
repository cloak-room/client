import { useEffect, useState } from "react";
import { apiUrl } from "../App";
import { ItemType, PaymentMethod } from "./types";

export default function useData<T>(
  getData: (...args: any[]) => Promise<T>,
  ...args: any[]
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(false);

  useEffect(() => {
    (async () => {
      try {
        setData(await getData());
        setLoading(false);
      } catch (err) {
        setData(null);
        setLoading(false);
        setError(err);
      }
    })();
  }, [getData, ...args]);

  return { data, loading, error };
}

async function getItemTypes() {
  const url = `${apiUrl}/item_types`;
  const response = await fetch(url);
  console.log(response);

  const data: ItemType[] = await response.json();
  console.log(data);

  return data;
}

async function getByDate(date: string | null) {
  const d = date ? new Date(date) : new Date();

  const startTime = new Date(d.getTime());
  startTime.setHours(0, 0, 0, 0);

  const endTime = new Date(d.getTime());
  endTime.setHours(23, 59, 0, 0);

  const res = await fetch(
    `${apiUrl}/items?from=${startTime.toISOString()}&to=${endTime.toISOString()}`
  );

  return await res.json();
}

async function getPaymentMethods() {
  const url = `${apiUrl}/payment_methods`;
  const response = await fetch(url);

  const data: PaymentMethod[] = await response.json();

  return data;
}

export function usePaymentMethods() {
  return useData(getPaymentMethods);
}

export function useDaily(date: string | null = null) {
  return useData(getByDate, date);
}

export function useItemTypes() {
  return useData(getItemTypes);
}
