// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Panel, VStack, Grid, Muted } from "../components/Layout.jsx";
// import FiltersBar from "../components/FiltersBar.jsx";
// import KPICard from "../components/KPICard.jsx";
// import { KPIGrid } from "../components/KPIGroup.jsx";
// import {
//   fetchParkingsForFilters,
//   fetchByParkingStats,
//   fetchPeaks,
//   fetchParkingHistory,
// } from "../api/client.js";
// import { getFiltersFromURL, setFiltersInURL } from "../utils/urlState.js";
// import ChartPanel from "../components/ChartPanel.jsx";
// import ByParkingChart from "../components/charts/ByParkingChart.jsx";
// import HourlyAvgChart from "../components/charts/HourlyAvgChart.jsx";
// import DailyMaxChart from "../components/charts/DailyMaxChart.jsx";
// import LiveOverview from "../components/LiveOverview.jsx";
// import ParkingPicker from "../components/ParkingPicker.jsx";
// import MetadataBanner from "../components/MetadataBanner.jsx";
// import OpenDataTable from "../components/OpenDataTable.jsx";
// import DocumentsList from "../components/DocumentsList.jsx";
// import {
//   allowedParkingIds,
//   displayNameMap,
// } from "../config/allowedParkings.js";
// import {
//   toHourlyAvgFromHistory,
//   toDailyMaxFromHistory,
// } from "../utils/series.js";

// import ErrorBoundary from "../components/ErrorBoundary.jsx";

// export default function PublicDashboard() {
//   const [filters, setFilters] = React.useState(getFiltersFromURL());
//   const [range, setRange] = React.useState({ from: "", to: "" });
//   const [focusParkingId, setFocusParkingId] = React.useState("");

//   React.useEffect(() => {
//     setFiltersInURL(filters);
//   }, [filters]);

//   // meta za selecte
//   const { data: parkingsForFilters } = useQuery({
//     queryKey: ["parkings-filter-meta", filters],
//     queryFn: () => fetchParkingsForFilters(filters),
//   });

//   // live/by-parking lista
//   const { data: byParking, isLoading: loadingByParking } = useQuery({
//     queryKey: ["by-parking", filters],
//     queryFn: () => fetchByParkingStats(filters),
//   });

//   // ograniči na 3 odobrena (Haustor, Dom, Musala)
//   const allowed = React.useMemo(() => {
//     if (!byParking?.length) return [];
//     return byParking.filter((p) =>
//       allowedParkingIds.includes(String(p.parkingId))
//     );
//   }, [byParking]);

//   const kpi = React.useMemo(() => {
//     const total = allowed.reduce(
//       (acc, r) => acc + (r.numberOfParkingPlaces || 0),
//       0
//     );
//     const free = allowed.reduce((acc, r) => acc + (r.freeTotal || 0), 0);
//     const occupied = allowed.reduce((acc, r) => acc + (r.occupied || 0), 0);
//     const occupancyRatio = total ? occupied / total : 0;
//     const lastUpdated = allowed.length
//       ? new Date(
//           Math.max(...allowed.map((r) => +new Date(r.createdAt || 0)))
//         ).toISOString()
//       : null;
//     return { total, free, occupied, occupancyRatio, lastUpdated };
//   }, [allowed]);

//   const zones = React.useMemo(() => {
//     const set = new Set();
//     if (parkingsForFilters?.rows) {
//       for (const r of parkingsForFilters.rows) set.add(r.zoneName || "");
//     }
//     return Array.from(set).sort();
//   }, [parkingsForFilters]);

//   const types = React.useMemo(() => {
//     const set = new Set();
//     if (parkingsForFilters?.rows) {
//       for (const r of parkingsForFilters.rows) set.add(r.parkingTypeId || "");
//     }
//     return Array.from(set).sort();
//   }, [parkingsForFilters]);

//   const onChangeFilters = (patch) =>
//     setFilters((prev) => ({ ...prev, ...patch }));
//   const onClearFilters = () =>
//     setFilters({ q: "", zoneName: "", parkingTypeId: "", minFree: "" });

//   // GLOBAL peaks
//   const cleaned = cleanedRange(range);
//   const { data: peaks, isLoading: loadingPeaks } = useQuery({
//     queryKey: ["peaks", filters, cleaned],
//     queryFn: () => fetchPeaks(filters, cleaned),
//   });

//   // pojedinačni parking – history
//   const { data: history, isLoading: loadingHistory } = useQuery({
//     queryKey: ["history", focusParkingId, cleaned],
//     queryFn: () => fetchParkingHistory(focusParkingId, cleaned),
//     enabled: Boolean(focusParkingId),
//   });

//   const hourlySolo = React.useMemo(
//     () => (history?.length ? toHourlyAvgFromHistory(history) : []),
//     [history]
//   );
//   const dailySolo = React.useMemo(
//     () => (history?.length ? toDailyMaxFromHistory(history) : []),
//     [history]
//   );

//   // picker opcije ograničene na tri parkinga
//   const pickerOptions = React.useMemo(() => {
//     const idToLabel = new Map();
//     for (const p of allowed) {
//       const label =
//         displayNameMap[p.parkingName] || p.parkingName || p.parkingId;
//       idToLabel.set(String(p.parkingId), label);
//     }
//     allowedParkingIds.forEach((id) => {
//       if (!idToLabel.has(id)) idToLabel.set(id, `Parking ${id}`);
//     });
//     return Array.from(idToLabel.entries()).map(([value, label]) => ({
//       value,
//       label,
//     }));
//   }, [allowed]);

//   return (
//     <VStack>
//       {/* 1) LIVE pregled */}
//       <Panel>
//         <h2 style={{ marginTop: 0 }}>Pregled zauzetosti (live)</h2>
//         <ErrorBoundary label="LiveOverview">
//           <LiveOverview baseFilters={{}} />
//         </ErrorBoundary>
//       </Panel>

//       {/* 2) Globalni filteri */}
//       <FiltersBar
//         filters={filters}
//         zones={zones}
//         types={types}
//         onChange={onChangeFilters}
//         onClear={onClearFilters}
//       />

//       {/* 3) KPI za tri parkinga */}
//       <Panel>
//         <VStack>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "baseline",
//             }}
//           >
//             <h2 style={{ margin: 0 }}>Pregled (Haustor, Dom, Musala)</h2>
//             {kpi.lastUpdated && (
//               <Muted>
//                 Zadnje ažuriranje: {new Date(kpi.lastUpdated).toLocaleString()}
//               </Muted>
//             )}
//           </div>

//           {loadingByParking ? (
//             <Muted>Učitavanje…</Muted>
//           ) : !allowed.length ? (
//             <Muted>Nema podataka za izabrane filtere.</Muted>
//           ) : (
//             <KPIGrid>
//               <KPICard title="Ukupno mjesta" value={kpi.total} />
//               <KPICard title="Slobodna" value={kpi.free} />
//               <KPICard title="Zauzeta" value={kpi.occupied} />
//               <KPICard
//                 title="Zauzeće"
//                 value={Math.round((kpi.occupancyRatio || 0) * 100)}
//                 suffix="%"
//               />
//             </KPIGrid>
//           )}
//         </VStack>
//       </Panel>

//       {/* 4) Grafovi */}
//       <Grid style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
//         <div style={{ gridColumn: "span 12" }}>
//           <ChartPanel
//             title="Zauzeće po parkingu (Top 3)"
//             subtitle="Stacked bar: Zauzeta + Slobodna"
//           >
//             {loadingByParking ? (
//               <Muted>Učitavanje…</Muted>
//             ) : !allowed.length ? (
//               <Muted>Nema podataka.</Muted>
//             ) : (
//               <ByParkingChart data={allowed} limit={3} />
//             )}
//           </ChartPanel>
//         </div>

//         <div style={{ gridColumn: "span 12" }}>
//           <ChartPanel
//             title="Zauzeće – satni prosjek (GLOBALNO)"
//             subtitle="Prosjek po satu za sve podatke"
//             actions={<RangeInputs value={range} onChange={setRange} />}
//           >
//             {loadingPeaks ? (
//               <Muted>Učitavanje…</Muted>
//             ) : !peaks?.hourly?.length ? (
//               <Muted>Nema podataka za period.</Muted>
//             ) : (
//               <HourlyAvgChart data={peaks.hourly} />
//             )}
//           </ChartPanel>
//         </div>

//         <div style={{ gridColumn: "span 12" }}>
//           <ChartPanel
//             title="Zauzeće – dnevni maksimum (GLOBALNO)"
//             subtitle="Maksimum po danima u sedmici"
//           >
//             {loadingPeaks ? (
//               <Muted>Učitavanje…</Muted>
//             ) : !peaks?.daily?.length ? (
//               <Muted>Nema podataka za period.</Muted>
//             ) : (
//               <DailyMaxChart data={peaks.daily} />
//             )}
//           </ChartPanel>
//         </div>

//         {/* Pojedinačni parking */}
//         <div style={{ gridColumn: "span 12" }}>
//           <ChartPanel
//             title="Pojedinačni parking – satni prosjek"
//             subtitle="Odaberi parking i period; izračun iz history endpointa"
//             actions={
//               <div
//                 style={{
//                   display: "flex",
//                   gap: 16,
//                   alignItems: "center",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <ParkingPicker
//                   options={pickerOptions}
//                   value={focusParkingId}
//                   onChange={setFocusParkingId}
//                 />
//                 <RangeInputs value={range} onChange={setRange} />
//               </div>
//             }
//           >
//             {!focusParkingId ? (
//               <Muted>Odaberi parking iz padajuće liste.</Muted>
//             ) : loadingHistory ? (
//               <Muted>Učitavanje…</Muted>
//             ) : !hourlySolo.length ? (
//               <Muted>Nema podataka za period.</Muted>
//             ) : (
//               <HourlyAvgChart data={hourlySolo} />
//             )}
//           </ChartPanel>
//         </div>

//         <div style={{ gridColumn: "span 12" }}>
//           <ChartPanel title="Pojedinačni parking – dnevni maksimum">
//             {!focusParkingId ? (
//               <Muted>Odaberi parking iz padajuće liste.</Muted>
//             ) : loadingHistory ? (
//               <Muted>Učitavanje…</Muted>
//             ) : !dailySolo.length ? (
//               <Muted>Nema podataka za period.</Muted>
//             ) : (
//               <DailyMaxChart data={dailySolo} />
//             )}
//           </ChartPanel>
//         </div>
//       </Grid>

//       <Panel>
//         <h2 style={{ marginTop: 0 }}>Metapodaci skupa</h2>
//         <ErrorBoundary label="/api/v1/metadata">
//           <MetadataBanner />
//         </ErrorBoundary>
//       </Panel>

//       <Panel>
//         <h2 style={{ marginTop: 0 }}>Open data tabela</h2>
//         <ErrorBoundary label="OpenDataTable">
//           {/* <OpenDataTable /> */}
//         </ErrorBoundary>
//       </Panel>

//       <Panel>
//         <h2 style={{ marginTop: 0 }}>
//           Dokumenti (Odluke, Pravilnici, Uputstva)
//         </h2>
//         <ErrorBoundary label="/api/v1/documents">
//           <DocumentsList />
//         </ErrorBoundary>
//       </Panel>
//     </VStack>
//   );
// }

// function cleanedRange(range) {
//   const out = {};
//   if (range.from) out.from = new Date(range.from).toISOString();
//   if (range.to) out.to = new Date(range.to).toISOString();
//   return out;
// }

// function RangeInputs({ value, onChange }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         gap: 12,
//         alignItems: "center",
//         flexWrap: "wrap",
//       }}
//     >
//       <label>
//         <small>Od:&nbsp;</small>
//         <input
//           type="datetime-local"
//           value={value.from}
//           onChange={(e) => onChange({ ...value, from: e.target.value })}
//         />
//       </label>
//       <label>
//         <small>Do:&nbsp;</small>
//         <input
//           type="datetime-local"
//           value={value.to}
//           onChange={(e) => onChange({ ...value, to: e.target.value })}
//         />
//       </label>
//       <button
//         onClick={() => onChange({ from: "", to: "" })}
//         style={{ cursor: "pointer" }}
//       >
//         Reset perioda
//       </button>
//     </div>
//   );
// }

import React from "react";
import { VStack } from "../components/Layout.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";

import LivePanel from "../components/dashboard/LivePanel.jsx";
import FiltersContainer from "../components/dashboard/FiltersContainer.jsx";
import KPIOverview from "../components/dashboard/KPIOverview.jsx";
import ChartsSection from "../components/dashboard/ChartsSection.jsx";
import MetadataPanel from "../components/dashboard/MetadataPanel.jsx";
import DocumentsPanel from "../components/dashboard/DocumentsPanel.jsx";
import OpenDataPanel from "../components/dashboard/OpenDataPanel.jsx"; // (opcionalno)

import { getFiltersFromURL, setFiltersInURL } from "../utils/urlState.js";

export default function PublicDashboard() {
  const [filters, setFilters] = React.useState(getFiltersFromURL());

  React.useEffect(() => {
    setFiltersInURL(filters);
  }, [filters]);

  return (
    <VStack>
      <ErrorBoundary label="LivePanel">
        <LivePanel />
      </ErrorBoundary>
      <ErrorBoundary label="MetadataPanel">
        <MetadataPanel />
      </ErrorBoundary>

      <ErrorBoundary label="OpenDataPanel">
        <OpenDataPanel />
      </ErrorBoundary>

      <ErrorBoundary label="DocumentsPanel">
        <DocumentsPanel />
      </ErrorBoundary>

      <ErrorBoundary label="ChartsSection">
        <ChartsSection filters={filters} />
      </ErrorBoundary>
    </VStack>
  );
}
