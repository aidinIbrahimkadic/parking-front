import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Panel, VStack, Muted } from "../Layout.jsx";
import KPICard from "../KPICard.jsx";
import { KPIGrid } from "../KPIGroup.jsx";
import { fetchByParkingStats } from "../../api/client.js";
import { allowedParkingIds } from "../../config/allowedParkings.js";

export default function KPIOverview({ filters }) {
  const { data: byParking, isLoading } = useQuery({
    queryKey: ["by-parking", filters],
    queryFn: () => fetchByParkingStats(filters),
  });

  const allowed = React.useMemo(() => {
    if (!byParking?.length) return [];
    return byParking.filter((p) =>
      allowedParkingIds.includes(String(p.parkingId))
    );
  }, [byParking]);

  const kpi = React.useMemo(() => {
    const total = allowed.reduce(
      (acc, r) => acc + (r.numberOfParkingPlaces || 0),
      0
    );
    const free = allowed.reduce((acc, r) => acc + (r.freeTotal || 0), 0);
    const occupied = allowed.reduce((acc, r) => acc + (r.occupied || 0), 0);
    const occupancyRatio = total ? occupied / total : 0;
    const lastUpdated = allowed.length
      ? new Date(
          Math.max(...allowed.map((r) => +new Date(r.createdAt || 0)))
        ).toISOString()
      : null;
    return { total, free, occupied, occupancyRatio, lastUpdated };
  }, [allowed]);

  return (
    <Panel>
      <VStack>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h2 style={{ margin: 0 }}>Pregled (Haustor, Dom, Musala)</h2>
          {kpi.lastUpdated && (
            <Muted>
              Zadnje ažuriranje: {new Date(kpi.lastUpdated).toLocaleString()}
            </Muted>
          )}
        </div>

        {isLoading ? (
          <Muted>Učitavanje…</Muted>
        ) : !allowed.length ? (
          <Muted>Nema podataka za izabrane filtere.</Muted>
        ) : (
          <KPIGrid>
            <KPICard title="Ukupno mjesta" value={kpi.total} />
            <KPICard title="Slobodna" value={kpi.free} />
            <KPICard title="Zauzeta" value={kpi.occupied} />
            <KPICard
              title="Zauzeće"
              value={Math.round((kpi.occupancyRatio || 0) * 100)}
              suffix="%"
            />
          </KPIGrid>
        )}
      </VStack>
    </Panel>
  );
}
