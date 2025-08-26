import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useTheme } from "styled-components";

function truncate(str, n = 12) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

function formatInt(v) {
  return new Intl.NumberFormat().format(v ?? 0);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const total =
    (payload.find((p) => p.dataKey === "freeTotal")?.value || 0) +
    (payload.find((p) => p.dataKey === "occupied")?.value || 0);
  const occ = total
    ? Math.round(
        ((total -
          (payload.find((p) => p.dataKey === "freeTotal")?.value || 0)) /
          total) *
          100
      )
    : 0;

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.75)",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey}>
          {p.name}: <b>{formatInt(p.value)}</b>
        </div>
      ))}
      <div style={{ marginTop: 6, opacity: 0.9 }}>
        Ukupno: <b>{formatInt(total)}</b> · Zauzeće: <b>{occ}%</b>
      </div>
    </div>
  );
}

export default function ByParkingChart({ data = [], limit = 20 }) {
  const theme = useTheme();

  // sortiraj po najvećem zauzeću, pa uzmi top N
  const sorted = [...data]
    .sort((a, b) => b.occupied - a.occupied)
    .slice(0, limit);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sorted} stackOffset="none">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="parkingName" tickFormatter={(v) => truncate(v, 12)} />
        <YAxis tickFormatter={formatInt} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="occupied"
          name="Zauzeta"
          stackId="a"
          fill={theme.colors.danger}
        />
        <Bar
          dataKey="freeTotal"
          name="Slobodna"
          stackId="a"
          fill={theme.colors.success}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
