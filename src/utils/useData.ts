import { useEffect, useState } from "react";
import { apiUrl } from "../App";
import { Item, ItemResult, ItemType, PaymentMethod } from "./types";
import useMessage from "./useMessage";

function retryAfterTimeout(
  toast: any,
  refresh: any,
  timeout: number,
  err?: any
) {
  setTimeout(() => {
    refresh();
  }, timeout);
  toast.present(`Failed to connect. Retrying in ${timeout / 1000}s`, true);
}

async function parseJSON(response: Response) {
  try {
    return await response.json();
  } catch {
    throw await response;
  }
}

export default function useData<T>(
  getData: (...args: any[]) => Promise<T>,
  ...args: any[]
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(false);

  const toast = useMessage();

  const [r, setR] = useState(0);

  const refresh = (): void => setR((o) => o + 1);

  useEffect(() => {
    (async () => {
      try {
        setData(await getData());
        setLoading(false);
        if (r > 0) {
          setR(0);
        } else if (r > 1) {
          toast.present(`Connection established after ${r} attempts`, false);
        }
      } catch (err) {
        console.log(data);
        setData(null);
        setLoading(false);
        setError(err);
        console.log("error", err);
        retryAfterTimeout(toast, refresh, 5000, err);
      }
    })();
  }, [getData, r, ...args]);

  return { data, loading, error, refresh };
}

async function getItemTypes() {
  const url = `${apiUrl}/item_types`;
  const response = await fetch(url);
  console.log(response);

  const data: ItemType[] = await parseJSON(response);
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

  return await parseJSON(res);
}

async function getItems({
  search = "",
  start = "",
  end = "",
  currentPage = 1,
  showCollected = false,
  showStored = true,
  perPage,
  itemID,
  stats = false,
  userID,
}: {
  search?: string;
  start?: string;
  end?: string;
  currentpage?: number;
  showCollected?: boolean;
  showStored?: boolean;
  currentPage?: number;
  perPage?: number;
  itemID?: string;
  stats?: boolean;
  userID?: number;
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
  const userIDToken = userID == null ? "" : `userId=${userID}&`;
  const statsToken = stats ? "/stats" : "";

  const collectedToken =
    showCollected === null ? "" : `showCollected=${showCollected ? 1 : 0}&`;
  const storedToken =
    showStored === null ? "" : `showStored=${showStored ? 1 : 0}&`;
  const res = await fetch(
    `${apiUrl}/items${statsToken}?${searchToken}${startToken}${endToken}${pageToken}${collectedToken}${storedToken}${perPageToken}${itemIDToken}${userIDToken}`
  );

  const data = await res.json();
  return data;
}

async function getPaymentMethods() {
  const url = `${apiUrl}/payment_methods`;
  const response = await fetch(url);
  console.log(response);
  const data: PaymentMethod[] = await parseJSON(response);

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
  showStored = true,
  perPage,
  itemID,
}: {
  search?: string;
  start?: string;
  end?: string;
  showCollected?: boolean;
  showStored?: boolean;

  currentPage?: number;
  perPage?: number;
  itemID?: string;
}) {
  const [data, setData] = useState<ItemResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(false);
  const [r, setR] = useState(0);
  const toast = useMessage();

  const refresh = (): void => setR((o) => o + 1);

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
            showStored,
            perPage,
            itemID,
          })
        );
        setLoading(false);
        if (r > 0) {
          setR(0);
        } else if (r > 1) {
          toast.present(`Connection established after ${r} attempts`, false);
        }
      } catch (err) {
        setData(null);
        setLoading(false);
        setError(err);
        retryAfterTimeout(toast, refresh, 5000, err);
      }
    })();
  }, [
    search,
    start,
    end,
    r,
    currentPage,
    showCollected,
    showStored,
    itemID,
    perPage,
  ]);
  console.log(data);

  return {
    data: data?.data,
    loading,
    error,
    refresh,
    pageCount: data?.pageCount,
  };
}

export function useStatistics({
  search = "",
  start = "",
  end = "",
  currentPage = 1,
  showCollected = false,
  perPage,
  itemID,
  userID,
}: {
  search?: string;
  start?: string;
  end?: string;
  currentpage?: number;
  showCollected?: boolean;
  currentPage?: number;
  perPage?: number;
  itemID?: string;
  userID?: number;
}) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(false);
  const [r, setR] = useState(0);
  const toast = useMessage();

  const refresh = (): void => setR((o) => o + 1);

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
            stats: true,
            userID,
          })
        );
        setLoading(false);
        if (r > 0) {
          setR(0);
        } else if (r > 1) {
          toast.present(`Connection established after ${r} attempts`, false);
        }
      } catch (err) {
        setData(null);
        setLoading(false);
        setError(err);
        retryAfterTimeout(toast, refresh, 5000, err);
      }
    })();
  }, [
    search,
    start,
    end,
    r,
    currentPage,
    showCollected,
    itemID,
    perPage,
    userID,
  ]);
  console.log(data);

  return {
    data: data?.stats,
    loading,
    error,
    refresh,
    pageCount: data?.pageCount,
  };
}
