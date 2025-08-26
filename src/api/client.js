import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

export function toQuery(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    sp.set(k, String(v));
  });
  return sp.toString();
}

// Helpers for specific endpoints
export async function fetchOverview(filters) {
  const qs = toQuery(filters);
  const { data } = await api.get(`/stats/overview${qs ? `?${qs}` : ""}`);
  return data;
}

export async function fetchParkingsForFilters(filters) {
  // we just need some rows to extract unique zoneName & parkingTypeId options
  const qs = toQuery({ ...filters, pageSize: 200, page: 1 });
  const { data } = await api.get(`/parkings${qs ? `?${qs}` : ""}`);
  return data;
}

// ADD to src/api/client.js
export async function fetchByParkingStats(filters) {
  const qs = toQuery(filters);
  const { data } = await api.get(`/stats/by-parking${qs ? `?${qs}` : ""}`);
  return data; // array
}

export async function fetchPeaks(filters, range = {}) {
  const qs = toQuery({ ...filters, ...range });
  const { data } = await api.get(`/stats/peaks${qs ? `?${qs}` : ""}`);
  return data; // { hourly, daily, ... }
}
export async function fetchParkingHistory(parkingId, range = {}) {
  if (!parkingId) return [];
  const qs = toQuery(range);
  const { data } = await api.get(
    `/parkings/${encodeURIComponent(parkingId)}/history${qs ? `?${qs}` : ""}`
  );
  return data; // array of snapshots
}
