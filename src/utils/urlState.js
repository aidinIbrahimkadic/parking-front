export function getFiltersFromURL() {
  const sp = new URLSearchParams(window.location.search);
  const q = sp.get("q") || "";
  const zoneName = sp.get("zoneName") || "";
  const parkingTypeId = sp.get("parkingTypeId") || "";
  const minFreeRaw = sp.get("minFree");
  const minFree =
    minFreeRaw !== null && minFreeRaw !== "" ? Number(minFreeRaw) : "";
  return { q, zoneName, parkingTypeId, minFree };
}

export function setFiltersInURL(filters) {
  const sp = new URLSearchParams(window.location.search);
  Object.entries(filters).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") sp.delete(k);
    else sp.set(k, String(v));
  });
  const qs = sp.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
  window.history.replaceState({}, "", url);
}
