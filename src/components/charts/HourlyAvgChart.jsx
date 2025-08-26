import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTheme } from "styled-components";

function toPercent(v) {
  return Math.round((v ?? 0) * 100);
}

export default function HourlyAvgChart({ data = [] }) {
  const theme = useTheme();
  const rows = (data || []).map((d) => ({
    ...d,
    pct: toPercent(d.occupancyRatioAvg),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
        <XAxis dataKey="hour" />
        <YAxis tickFormatter={(v) => `${v}%`} />
        <Tooltip
          formatter={(v, n) => (n === "pct" ? [`${v}%`, "Zauzeće"] : v)}
        />
        <Bar dataKey="pct" name="Zauzeće" fill={theme.colors.accent} />
      </BarChart>
    </ResponsiveContainer>
  );
}
