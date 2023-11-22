import { useEffect, useState } from "react";
import { apiUrl } from "../App";
import { Item, ItemResult, ItemType, PaymentMethod } from "./types";

export default function useData<T>(
  getData: (...args: any[]) => Promise<T>,
  ...args: any[]
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(false);

  const [r, setR] = useState(true);

  const refresh = (): void => setR((o) => !o);

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
  }, [getData, r, ...args]);

  return { data, loading, error, refresh };
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

async function getItems({
  search = "",
  start = "",
  end = "",
  currentPage = 1,
  showCollected = false,
  perPage,
  itemID,
}: {
  search?: string;
  start?: string;
  end?: string;
  currentpage?: number;
  showCollected?: boolean;
  currentPage?: number;
  perPage?: number;
  itemID?: string;
}) {
  console.log(search);
  // const startTime = new Date(start);
  // const endTime = new Date(end);

  const searchToken = search === "" ? "" : `q=${search}&`;
  const startToken = start === "" ? "" : `from=${start}&`;
  const endToken = end === "" ? "" : `to=${end}&`;
  const pageToken = currentPage === null ? "" : `p=${currentPage}&`;
  const perPageToken = perPage === null ? "" : `perPage=${perPage}&`;
  const itemIDToken = itemID == null ? "" : `id=${itemID}&`;

  const collectedToken =
    showCollected === null ? "" : `showCollected=${showCollected ? 1 : 0}&`;
  const res = await fetch(
    `${apiUrl}/items?${searchToken}${startToken}${endToken}${pageToken}${collectedToken}${perPageToken}${itemIDToken}`
  );

  const data = await res.json();

  data.data.sort((a: Item, b: Item) => {
    var textA = a.ownerName.toUpperCase();
    var textB = b.ownerName.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  return data;
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

export function useItems({
  search = "",
  start = "",
  end = "",
  currentPage = 1,
  showCollected = false,
  perPage,
  itemID,
}: {
  search?: string;
  start?: string;
  end?: string;
  currentpage?: number;
  showCollected?: boolean;
  currentPage?: number;
  perPage?: number;
  itemID?: string;
}) {
  const [data, setData] = useState<ItemResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(false);
  const [r, setR] = useState(true);

  const refresh = (): void => setR((o) => !o);

  useEffect(() => {
    (async () => {
      try {
        setData(
          await getItems({
            search,
            start,
            end,
            currentPage,
            showCollected,
            perPage,
            itemID,
          })
        );
        setLoading(false);
      } catch (err) {
        setData(null);
        setLoading(false);
        setError(err);
      }
    })();
  }, [search, start, end, r, currentPage, showCollected]);
  console.log(data);

  return {
    data: data?.data,
    loading,
    error,
    refresh,
    pageCount: data?.pageCount,
  };
}
