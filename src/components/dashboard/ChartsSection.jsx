// src/components/sections/ChartsSection.jsx
import React from "react";
import styled from "styled-components";
import { Grid, Muted } from "../Layout.jsx";
import ChartPanel from "../ChartPanel.jsx";
import ByParkingChart from "../charts/ByParkingChart.jsx";
import HourlyAvgChart from "../charts/HourlyAvgChart.jsx";
import DailyMaxChart from "../charts/DailyMaxChart.jsx";
import { fetchByParkingStats, fetchPeaks } from "../../api/client.js";
import {
  allowedParkingIds,
  displayNameMap,
} from "../../config/allowedParkings.js";

/* ---------- UI helpers ---------- */
const ControlsCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.05);
`;

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  font-size: 13px;
`;

const DateInput = styled.input.attrs({ type: "datetime-local" })`
  height: 36px;
  padding: 0 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  outline: none;
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
  /* oboji ikonicu kalendara */
  &::-webkit-calendar-picker-indicator {
    filter: invert(34%) sepia(23%) saturate(1530%) hue-rotate(220deg)
      brightness(92%) contrast(90%);
    cursor: pointer;
  }
`;

const GhostButton = styled.button`
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: 120ms ease;
  &:hover {
    background: #f8fafc;
  }
`;

/* ---------- helpers ---------- */
function cleanedRange(range) {
  const out = {};
  if (range.from) out.from = new Date(range.from).toISOString();
  if (range.to) out.to = new Date(range.to).toISOString();
  return out;
}

function RangeControls({ value, onChange }) {
  return (
    <ControlsCard>
      <Label>
        Od:
        <DateInput
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
        />
      </Label>
      <Label>
        Do:
        <DateInput
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
        />
      </Label>
      {(value.from || value.to) && (
        <GhostButton onClick={() => onChange({ from: "", to: "" })}>
          Reset perioda
        </GhostButton>
      )}
    </ControlsCard>
  );
}

/* ---------- minimalni wrapper za useQuery ---------- */
import { useQuery } from "@tanstack/react-query";
function useQueryWrap(key, fn, opts = {}) {
  return useQuery({ queryKey: key, queryFn: fn, ...opts });
}

/* ---------- komponenta ---------- */
export default function ChartsSection({ filters }) {
  const [range, setRange] = React.useState({ from: "", to: "" });

  // OGRANIČI SVE POZIVE NA 3 VALIDNA PARKINGA
  const restrictedFilters = React.useMemo(
    () => ({
      ...filters,
      // backend treba da podrži parkingIdIn (CSV string id-jeva)
      parkingIdIn: allowedParkingIds.join(","),
    }),
    [filters]
  );

  // By-parking (za stacked bar — i ovdje prosleđujemo parkingIdIn)
  const { data: byParking, isLoading: loadingByParking } = useQueryWrap(
    ["by-parking", restrictedFilters],
    () => fetchByParkingStats(restrictedFilters)
  );

  // Za svaki slučaj dodatni klijentski filter po allowed ids
  const allowedOnly = React.useMemo(() => {
    if (!byParking?.length) return [];
    return byParking
      .filter((p) => allowedParkingIds.includes(String(p.parkingId)))
      .map((p) => ({
        ...p,
        parkingName:
          displayNameMap[p.parkingName] || p.parkingName || p.parkingId,
      }));
  }, [byParking]);

  // Peakovi (GLOBALNO, ali limitirano na naša 3 parkinga)
  const cleaned = cleanedRange(range);
  const { data: peaks, isLoading: loadingPeaks } = useQueryWrap(
    ["peaks", restrictedFilters, cleaned],
    () => fetchPeaks(restrictedFilters, cleaned)
  );

  return (
    <Grid style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
      {/* Stacked bar: po parkingu (samo 3) */}
      <div style={{ gridColumn: "span 12" }}>
        <ChartPanel
          title="Zauzeće po parkingu (Top 3)"
          subtitle="Haustor, Dom, Musala (zauzeta + slobodna)"
        >
          {loadingByParking ? (
            <Muted>Učitavanje…</Muted>
          ) : !allowedOnly.length ? (
            <Muted>Nema podataka.</Muted>
          ) : (
            <ByParkingChart data={allowedOnly} limit={3} />
          )}
        </ChartPanel>
      </div>

      {/* Satni prosjek (samo 3 parkinga) */}
      <div style={{ gridColumn: "span 12" }}>
        <ChartPanel
          title="Zauzeće – satni prosjek"
          subtitle="Prosjek po satu za Haustor, Dom i Musala"
          actions={<RangeControls value={range} onChange={setRange} />}
        >
          {loadingPeaks ? (
            <Muted>Učitavanje…</Muted>
          ) : !peaks?.hourly?.length ? (
            <Muted>Nema podataka za period.</Muted>
          ) : (
            <HourlyAvgChart data={peaks.hourly} />
          )}
        </ChartPanel>
      </div>

      {/* Dnevni maksimum (samo 3 parkinga) */}
      <div style={{ gridColumn: "span 12" }}>
        <ChartPanel
          title="Zauzeće – dnevni maksimum"
          subtitle="Maksimum po danima u sedmici (samo 3 parkinga)"
        >
          {loadingPeaks ? (
            <Muted>Učitavanje…</Muted>
          ) : !peaks?.daily?.length ? (
            <Muted>Nema podataka za period.</Muted>
          ) : (
            <DailyMaxChart data={peaks.daily} />
          )}
        </ChartPanel>
      </div>
    </Grid>
  );
}
