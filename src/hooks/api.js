// src/hooks/api.js
import { useQuery } from "@tanstack/react-query";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
  "https://open-parking.opcina-tesanj.ba/api/v1";

const qstr = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== "" && v !== null)
    .map(([k, v]) => {
      const val =
        v instanceof Date
          ? v.toISOString()
          : typeof v === "object"
          ? JSON.stringify(v)
          : String(v);
      return `${encodeURIComponent(k)}=${encodeURIComponent(val)}`;
    })
    .join("&");

async function fetchJson(path, params) {
  const url = params
    ? `${API_BASE}${path}?${qstr(params)}`
    : `${API_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

/* =========================
 * PARKINGS (zadnje stanje)
 * ========================= */
export function useParkings({
  page = 1,
  pageSize = 100,
  sort = "createdAt",
  order = "desc",
  parkingIdIn = "", // CSV (npr "67,66,70")
} = {}) {
  const params = {
    page,
    pageSize,
    sort,
    order,
    ...(parkingIdIn ? { parkingIdIn } : {}),
  };
  return useQuery({
    queryKey: ["parkings", params],
    queryFn: () => fetchJson("/parkings", params),
    keepPreviousData: true,
  });
}

/* =========================
 * SNAPSHOTS (historija)
 * ========================= */
export function useSnapshots(params) {
  return useQuery({
    queryKey: ["snapshots", params],
    queryFn: () => fetchJson("/snapshots", params),
    enabled: Boolean(params?.parkingIdIn), // treba bar 1 parking
    keepPreviousData: true,
  });
}

/* ======== Overview/By-Parking/Peaks/Metadata/Documents (ako ti trebaju drugdje) ======== */
export function useOverview(filters = {}) {
  return useQuery({
    queryKey: ["overview", filters],
    queryFn: () => fetchJson("/stats/overview", filters),
    keepPreviousData: true,
  });
}
export function useByParking(filters = {}) {
  return useQuery({
    queryKey: ["by-parking", filters],
    queryFn: () => fetchJson("/stats/by-parking", filters),
    keepPreviousData: true,
  });
}
export function usePeaks(filters = {}, range = {}) {
  const params = {
    ...filters,
    ...(range.from ? { from: range.from } : {}),
    ...(range.to ? { to: range.to } : {}),
  };
  return useQuery({
    queryKey: ["peaks", params],
    queryFn: () => fetchJson("/stats/peaks", params),
    keepPreviousData: true,
  });
}
export function useMetadata() {
  return useQuery({
    queryKey: ["metadata"],
    queryFn: () => fetchJson("/site-metadata"),
    staleTime: 5 * 60 * 1000,
  });
}
export function useDocuments({
  q = "",
  doc_type = "",
  page = 1,
  pageSize = 10,
} = {}) {
  const params = { q, doc_type, page, pageSize };
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () => fetchJson("/documents", params),
    keepPreviousData: true,
  });
}

/* =========================
 * URL helperi (API / Export)
 * ========================= */
export function getApiUrlLast(params = {}) {
  const qs = qstr(params);
  return `${API_BASE}/parkings?${qs}`;
}
export function getApiUrlHistory(params = {}) {
  const qs = qstr(params);
  return `${API_BASE}/snapshots?${qs}`;
}

export function getExportUrlLast(params = {}, format = "csv") {
  // Export backend treba da ignoriše paginaciju i vrati sve redove za filtere
  const qs = qstr({ ...params, format });
  return `${API_BASE}/export?${qs}`;
}
export function getExportUrlHistory(params = {}, format = "csv") {
  // Za historiju očekujemo /export-snapshots (isti filteri kao /snapshots)
  const qs = qstr({ ...params, format });
  return `${API_BASE}/export-snapshots?${qs}`;
}
