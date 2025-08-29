// // src/hooks/api.js
// import { useQuery } from "@tanstack/react-query";

// const API_BASE =
//   import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
//   "http://localhost:4000/api/v1";

// const qstr = (obj = {}) =>
//   Object.entries(obj)
//     .filter(([, v]) => v !== undefined && v !== "" && v !== null)
//     .map(
//       ([k, v]) =>
//         `${encodeURIComponent(k)}=${encodeURIComponent(
//           v instanceof Date ? v.toISOString() : String(v)
//         )}`
//     )
//     .join("&");

// async function fetchJson(path, params) {
//   const url = params
//     ? `${API_BASE}${path}?${qstr(params)}`
//     : `${API_BASE}${path}`;
//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
//   return res.json();
// }

// /* =========================
//  * PARKINGS (zadnje stanje)
//  * ========================= */
// export function useParkings({
//   q = "",
//   cityName = "",
//   zoneName = "",
//   parkingTypeId = "",
//   page = 1,
//   pageSize = 20,
//   sort = "createdAt",
//   order = "desc",
// } = {}) {
//   const params = {
//     q,
//     cityName,
//     zoneName,
//     parkingTypeId,
//     page,
//     pageSize,
//     sort,
//     order,
//   };
//   return useQuery({
//     queryKey: ["parkings", params],
//     queryFn: () => fetchJson("/parkings", params),
//     keepPreviousData: true,
//   });
// }

// /* ==========================================
//  * PARKINGS HISTORY (po parkingu, period)
//  * Backend endpoint vraća array; ovdje radimo
//  * klijentsku paginaciju i sortiranje.
//  * ========================================== */
// export function useParkingsHistory({
//   parkingId = "",
//   from = "",
//   to = "",
//   order = "asc",
//   page = 1,
//   pageSize = 100,
// } = {}) {
//   // Ako korisnik nije zadao period, default na zadnjih 7 dana
//   let fromISO = from;
//   let toISO = to;
//   if (!fromISO && !toISO) {
//     const now = new Date();
//     const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//     fromISO = weekAgo.toISOString();
//     toISO = now.toISOString();
//   }

//   // const enabled = Boolean(parkingId); // (opcija B) pooštri: parkingId && (from || to)

//   const enabled = Boolean(parkingId && (from || to));
//   return useQuery({
//     queryKey: [
//       "parking-history",
//       { parkingId, from: fromISO, to: toISO, order, page, pageSize },
//     ],
//     enabled,
//     queryFn: async () => {
//       // 1) dovuci SNAPSHOT-e za period (ograničen na 7 dana ako korisnik ne zada)
//       const list = await fetchJson(
//         `/parkings/${encodeURIComponent(parkingId)}/history`,
//         { from: fromISO, to: toISO }
//       );

//       // 2) sortiraj po createdAt (ASC/DESC)
//       const sorted = [...list].sort((a, b) => {
//         const da = +new Date(a.createdAt || 0);
//         const db = +new Date(b.createdAt || 0);
//         return order === "asc" ? da - db : db - da;
//       });

//       // 3) klijentska paginacija (manji skup → neće zamrznuti UI)
//       const total = sorted.length;
//       const start = Math.max(0, (page - 1) * pageSize);
//       const rows = sorted.slice(start, start + pageSize);

//       return { rows, total, page, pageSize };
//     },
//     keepPreviousData: true,
//   });
// }

// /* =========================
//  * OVERVIEW / BY-PARKING
//  * ========================= */
// export function useOverview(filters = {}) {
//   return useQuery({
//     queryKey: ["overview", filters],
//     queryFn: () => fetchJson("/stats/overview", filters),
//     keepPreviousData: true,
//   });
// }

// export function useByParking(filters = {}) {
//   return useQuery({
//     queryKey: ["by-parking", filters],
//     queryFn: () => fetchJson("/stats/by-parking", filters),
//     keepPreviousData: true,
//   });
// }

// /* ==============
//  * PEAKS (GLOBAL)
//  * ============== */
// export function usePeaks(filters = {}, range = {}) {
//   const params = {
//     ...filters,
//     ...(range.from ? { from: range.from } : {}),
//     ...(range.to ? { to: range.to } : {}),
//   };
//   return useQuery({
//     queryKey: ["peaks", params],
//     queryFn: () => fetchJson("/stats/peaks", params),
//     keepPreviousData: true,
//   });
// }

// /* ============
//  * METADATA
//  * ============ */
// export function useMetadata() {
//   return useQuery({
//     queryKey: ["metadata"],
//     queryFn: () => fetchJson("/metadata"),
//     staleTime: 5 * 60 * 1000,
//   });
// }

// /* ============
//  * DOCUMENTS
//  * ============ */
// export function useDocuments({
//   q = "",
//   doc_type = "",
//   page = 1,
//   pageSize = 10,
// } = {}) {
//   const params = { q, doc_type, page, pageSize };
//   return useQuery({
//     queryKey: ["documents", params],
//     queryFn: () => fetchJson("/documents", params),
//     keepPreviousData: true,
//   });
// }

// /* ===================================
//  * POMOĆNI pozivi za filter meta itd.
//  * =================================== */
// export function useParkingsFilterMeta(filters = {}) {
//   // Vrati veliku stranicu za popunjavanje selecta (zone, tipovi)
//   const params = {
//     ...filters,
//     page: 1,
//     pageSize: 200,
//     sort: "parkingName",
//     order: "asc",
//   };
//   return useQuery({
//     queryKey: ["parkings-filter-meta", params],
//     queryFn: () => fetchJson("/parkings", params),
//     keepPreviousData: true,
//   });
// }

// // Server gradi apsolutni URL preko /api-url endpointa.
// export async function getApiUrl(params = {}) {
//   const data = await fetchJson("/api-url", params); // { url: "..." }
//   return data?.url || `${API_BASE}/parkings?${qstr(params)}`;
// }

// // (Opcionalno) direktan export link za CSV/JSON/XLSX/XML
// export function getExportUrl(params = {}, format = "csv") {
//   const qs = qstr({ ...params, format });
//   return `${API_BASE}/export?${qs}`;
// }
// export async function fetchParkings(params = {}) {
//   return fetchJson("/parkings", params);
// }

// // === HISTORY (više parkinga) ===
// export async function fetchSnapshots(params = {}) {
//   // očekuje: { parkingIdIn: "P-001,P-002", from?, to?, order?, page?, pageSize? }
//   return fetchJson("/snapshots", params);
// }

// export function useSnapshots(params) {
//   return useQuery({
//     queryKey: ["snapshots", params],
//     queryFn: () => fetchSnapshots(params),
//     enabled: Boolean(params?.parkingIdIn), // tražimo bar 1 parking
//     keepPreviousData: true,
//   });
// }

// // === URL helperi za ExportBar / Copy API ===
// export function getApiUrlLast(params = {}) {
//   const qs = qstr(params);
//   return `${API_BASE}/parkings?${qs}`;
// }
// export function getApiUrlHistory(params = {}) {
//   const qs = qstr(params);
//   return `${API_BASE}/snapshots?${qs}`;
// }

// export function getExportUrlLast(params = {}, format = "csv") {
//   const qs = qstr({ ...params, format });
//   return `${API_BASE}/export?${qs}`;
// }

// src/hooks/api.js
import { useQuery } from "@tanstack/react-query";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
  "http://localhost:4000/api/v1";

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
