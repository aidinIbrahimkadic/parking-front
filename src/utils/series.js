// src/utils/series.js
function occRatioFromSnap(s) {
  const total =
    (s.totalNumberOfRegularPlaces || 0) + (s.totalNumberOfSpecialPlaces || 0);
  const free =
    (s.freeNumberOfRegularPlaces || 0) + (s.freeNumberOfSpecialPlaces || 0);
  return total ? (total - free) / total : 0;
}

export function toHourlyAvgFromHistory(snaps = []) {
  const buckets = Array.from({ length: 24 }, (_, h) => ({
    sum: 0,
    n: 0,
    hour: String(h).padStart(2, "0"),
  }));
  for (const s of snaps) {
    const d = new Date(s.createdAt);
    const h = d.getHours();
    buckets[h].sum += occRatioFromSnap(s);
    buckets[h].n += 1;
  }
  return buckets.map((b) => ({
    hour: b.hour,
    occupancyRatioAvg: b.n ? b.sum / b.n : 0,
    samples: b.n,
  }));
}

export function toDailyMaxFromHistory(snaps = []) {
  const days = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
  const buckets = Array.from({ length: 7 }, (_, dow) => ({
    dow,
    day: days[dow],
    max: 0,
    n: 0,
  }));
  for (const s of snaps) {
    const d = new Date(s.createdAt);
    const w = d.getDay(); // 0..6 (Ned..Sub)
    const r = occRatioFromSnap(s);
    if (r > buckets[w].max) buckets[w].max = r;
    buckets[w].n += 1;
  }
  return buckets.map((b) => ({
    dow: b.dow,
    day: b.day,
    occupancyRatioMax: b.max,
    samples: b.n,
  }));
}
