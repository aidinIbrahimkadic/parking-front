// src/admin/api/adminApi.js
import { queryClient } from "../../hooks/queryClient.js";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
  "http://localhost:4000/api/v1";

// === Token helper (kompatibilan sa starim i novim ključem) ===
function getToken() {
  try {
    return (
      localStorage.getItem("auth_token") ||
      localStorage.getItem("authToken") ||
      ""
    );
  } catch {
    return "";
  }
}

function toQuery(params = {}) {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    u.set(k, String(v));
  });
  return u.toString();
}

async function request(
  path,
  { method = "GET", params, body, isMultipart = false, headers } = {}
) {
  const qs = params ? `?${toQuery(params)}` : "";
  const url = `${API_BASE}${path}${qs}`;
  const token = getToken();

  const res = await fetch(url, {
    method,
    headers: {
      ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: isMultipart ? body : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // auto-logout/čišćenje cache-a
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("auth_user");
    } catch {}
    queryClient.clear();
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `${res.status} ${res.statusText}`);
  }

  // 204 no content
  if (res.status === 204) return null;

  return res.json();
}

// ——— PUBLIC HELPERS ———
export async function adminFetch(path, opts) {
  return request(path, opts);
}

// --- Admin: Meta ---
export const AdminAPI = {
  // napomena: backend rute su /admin/metadata (ne /admin/meta)
  getMeta: () => request("/admin/metadata"),
  updateMeta: (payload) =>
    request("/admin/metadata", { method: "PUT", body: payload }),
};

// --- Admin: Documents (admin rute za CRUD) ---
export async function listDocuments({
  q = "",
  doc_type = "",
  page = 1,
  pageSize = 10,
} = {}) {
  // LIST je public u backendu → i ovdje ide preko istog request wrappera
  return request("/documents", { params: { q, doc_type, page, pageSize } });
}

export async function createDocument(payload) {
  const fd = new FormData();
  if (payload.title) fd.append("title", payload.title);
  if (payload.doc_type) fd.append("doc_type", payload.doc_type);
  if (payload.description) fd.append("description", payload.description);
  if (payload.published_at) fd.append("published_at", payload.published_at);
  if (payload.file) fd.append("file", payload.file);

  return request("/admin/documents", {
    method: "POST",
    body: fd,
    isMultipart: true,
  });
}

export async function updateDocument(id, payload) {
  const fd = new FormData();
  if (payload.title != null) fd.append("title", payload.title);
  if (payload.doc_type != null) fd.append("doc_type", payload.doc_type);
  if (payload.description != null)
    fd.append("description", payload.description);
  if (payload.published_at != null)
    fd.append("published_at", payload.published_at);
  if (payload.file) fd.append("file", payload.file);

  return request(`/admin/documents/${id}`, {
    method: "PUT",
    body: fd,
    isMultipart: true,
  });
}

export async function deleteDocument(id) {
  return request(`/admin/documents/${id}`, { method: "DELETE" });
}

// --- (Kompatibilnost) AUTH helpers, ako ih negdje koristiš iz starog koda ---
export async function login(email, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  try {
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("authToken", data.token); // fallback ključ
    localStorage.setItem("auth_user", JSON.stringify(data.user || null));
  } catch {}
  return data;
}

export async function me() {
  return request("/auth/me");
}

export function logout() {
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("auth_user");
  } catch {}
  queryClient.clear();
}
