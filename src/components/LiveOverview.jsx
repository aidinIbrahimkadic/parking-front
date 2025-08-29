// // src/components/LiveOverview.jsx
// import React, { useMemo, useState } from "react";
// import styled from "styled-components";
// import { useOverview, useByParking } from "../hooks/api.js";

// const Wrap = styled.section`
//   display: grid;
//   gap: 16px;
// `;
// const Cards = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, minmax(160px, 1fr));
//   gap: 12px;
//   @media (max-width: 900px) {
//     grid-template-columns: 1fr 1fr;
//   }
// `;
// const Card = styled.div`
//   background: #fff;
//   border: 1px solid #eee;
//   border-radius: 12px;
//   padding: 14px;
//   h4 {
//     margin: 0 0 6px;
//     font-size: 14px;
//     color: #666;
//   }
//   strong {
//     font-size: 22px;
//   }
// `;
// const Filters = styled.div`
//   display: flex;
//   gap: 12px;
//   flex-wrap: wrap;
//   align-items: center;
//   label {
//     display: inline-flex;
//     gap: 6px;
//     align-items: center;
//   }
// `;

// const DEFAULT_PICK = ["Parking_Haustor", "Parking_Dom", "Parking_Musala"]; // Names iz tvoje /find-all
// const NAME_MAP = {
//   Parking_Haustor: "Haustor",
//   Parking_Dom: "Dom",
//   Parking_Musala: "Musala",
// };

// export default function LiveOverview({ baseFilters = {} }) {
//   // Preuzmi agregat + listu po parkingu
//   const { data: agg } = useOverview(baseFilters);
//   const { data: by } = useByParking(baseFilters);

//   const parkings = useMemo(() => (by ?? []).map((r) => r.parkingName), [by]);
//   const [selected, setSelected] = useState(() =>
//     parkings.length
//       ? parkings.filter((n) => DEFAULT_PICK.includes(n))
//       : DEFAULT_PICK
//   );

//   // Izračun prikaza: ako je išta selektovano -> računa se iz byParking (freeTotal/occupied)
//   const computed = useMemo(() => {
//     if (!by || !by.length) return null;
//     const subset = selected?.length
//       ? by.filter((r) => selected.includes(r.parkingName))
//       : by;

//     const total = subset.reduce(
//       (a, r) => a + (r.numberOfParkingPlaces || 0),
//       0
//     );
//     const free = subset.reduce((a, r) => a + (r.freeTotal || 0), 0);
//     const occupied = subset.reduce((a, r) => a + (r.occupied || 0), 0);
//     const ratio = total ? occupied / total : 0;

//     return { total, free, occupied, occupancyRatio: ratio };
//   }, [by, selected]);

//   const view = computed ||
//     agg || { total: 0, free: 0, occupied: 0, occupancyRatio: 0 };

//   return (
//     <Wrap>
//       <Filters>
//         <strong>Pregled (Live):</strong>
//         {(parkings.length ? parkings : DEFAULT_PICK).map((name) => (
//           <label key={name}>
//             <input
//               type="checkbox"
//               checked={selected.includes(name)}
//               onChange={(e) => {
//                 setSelected((old) =>
//                   e.target.checked
//                     ? [...new Set([...old, name])]
//                     : old.filter((n) => n !== name)
//                 );
//               }}
//             />
//             {NAME_MAP[name] || name}
//           </label>
//         ))}
//         <button onClick={() => setSelected([])}>Sve</button>
//         <button onClick={() => setSelected(DEFAULT_PICK)}>
//           Samo 3 (Haustor, Dom, Musala)
//         </button>
//       </Filters>

//       <Cards>
//         <Card>
//           <h4>Ukupno mjesta</h4>
//           <strong>{view.total?.toLocaleString?.() ?? 0}</strong>
//         </Card>
//         <Card>
//           <h4>Zauzeto</h4>
//           <strong>{view.occupied?.toLocaleString?.() ?? 0}</strong>
//         </Card>
//         <Card>
//           <h4>Slobodno</h4>
//           <strong>{view.free?.toLocaleString?.() ?? 0}</strong>
//         </Card>
//         <Card>
//           <h4>Popunjenost</h4>
//           <strong>{Math.round((view.occupancyRatio || 0) * 100)}%</strong>
//         </Card>
//       </Cards>
//     </Wrap>
//   );
// }

// src/components/LiveOverview.jsx
// src/components/LiveOverview.jsx
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useByParking } from "../hooks/api.js";
import {
  allowedParkingIds,
  allowedParkingNames,
  displayNameMap,
} from "../config/allowedParkings.js";

const Wrap = styled.section`
  display: grid;
  gap: 18px;
`;

const TopBar = styled.div`
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 24px;
  letter-spacing: 0.2px;
  display: flex;
  gap: 10px;
  align-items: center;
  color: #0f172a;
`;

const LiveDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.15);
  display: inline-block;
`;

const Select = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  border: 1px solid #e2e8f0;
  background: #ffffff; /* <— bijela pozadina */
  color: #0f172a; /* <— tamni tekst */
  border-radius: 12px;
  padding: 10px 14px;
  min-width: 240px;
  font-size: 14px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.05);
  outline: none;
  transition: box-shadow 0.2s ease, transform 0.07s ease;

  &:focus {
    box-shadow: 0 8px 26px rgba(2, 6, 23, 0.1);
    transform: translateY(-1px);
    border-color: #cbd5e1;
  }

  option {
    background: #ffffff; /* <— i opcije na bijeloj */
    color: #0f172a; /* <— i tekst opcija taman */
  }
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 14px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: 16px;
  background: radial-gradient(
      1200px 240px at -20% -20%,
      rgba(99, 102, 241, 0.12),
      transparent 60%
    ),
    radial-gradient(
      1200px 240px at 120% 120%,
      rgba(34, 197, 94, 0.12),
      transparent 60%
    ),
    linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
  backdrop-filter: saturate(1.05);

  h4 {
    margin: 0 0 6px;
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }
  strong {
    font-size: 28px;
    line-height: 1.1;
    color: #0f172a;
  }
`;

const Progress = styled.div`
  margin-top: 10px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  & > span {
    display: block;
    height: 100%;
    width: ${({ $pct }) => Math.max(0, Math.min(100, $pct))}%;
    background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e);
    filter: saturate(1.1);
    transition: width 0.5s ease;
  }
`;

const Subtle = styled.div`
  font-size: 12px;
  color: #64748b;
  display: flex;
  gap: 10px;
  align-items: center;
`;

function toLabel(nameOrId) {
  const key = String(nameOrId);
  return displayNameMap[key] || displayNameMap[`Parking_${key}`] || key;
}

export default function LiveOverview({ baseFilters = {} }) {
  const { data: by = [], isFetching } = useByParking(baseFilters);

  // samo tri odobrena
  const allowed = useMemo(() => {
    return (by || []).filter(
      (r) =>
        allowedParkingIds.includes(String(r.parkingId)) ||
        allowedParkingNames.includes(r.parkingName)
    );
  }, [by]);

  const selectOptions = useMemo(() => {
    const byId = new Map(
      allowed.map((r) => [String(r.parkingId), r.parkingName])
    );
    const ordered =
      allowedParkingIds
        .map((id) =>
          byId.has(String(id))
            ? { id: String(id), name: byId.get(String(id)) }
            : null
        )
        .filter(Boolean) || [];
    const extras = allowed
      .filter((r) => !ordered.find((o) => o.id === String(r.parkingId)))
      .map((r) => ({ id: String(r.parkingId), name: r.parkingName }));
    return [
      { id: "all", name: "Svi (Haustor, Dom, Musala)" },
      ...ordered,
      ...extras,
    ];
  }, [allowed]);

  const [picked, setPicked] = useState("all");

  const view = useMemo(() => {
    const src =
      picked === "all"
        ? allowed
        : allowed.filter((r) => String(r.parkingId) === String(picked));

    if (!src.length) {
      return {
        label: picked === "all" ? "Sva tri" : toLabel(picked),
        total: 0,
        free: 0,
        occupied: 0,
        occupancyRatio: 0,
        lastUpdated: null,
      };
    }

    const sum = (arr, getter) => arr.reduce((a, r) => a + (getter(r) || 0), 0);
    const total = sum(src, (r) => r.numberOfParkingPlaces);
    const free = sum(src, (r) =>
      r.freeTotal != null
        ? r.freeTotal
        : (r.freeNumberOfRegularPlaces || 0) +
          (r.freeNumberOfSpecialPlaces || 0)
    );
    const occupied = sum(src, (r) =>
      r.occupied != null
        ? r.occupied
        : (r.numberOfParkingPlaces || 0) -
          ((r.freeNumberOfRegularPlaces || 0) +
            (r.freeNumberOfSpecialPlaces || 0))
    );
    const occupancyRatio = total ? occupied / total : 0;

    const lastUpdated = new Date(
      Math.max(...src.map((r) => +new Date(r.createdAt || r.updatedAt || 0)))
    );

    return {
      label:
        picked === "all"
          ? "Sva tri (Haustor, Dom, Musala)"
          : toLabel(
              src.length === 1 ? src[0].parkingName || src[0].parkingId : picked
            ),
      total,
      free,
      occupied,
      occupancyRatio,
      lastUpdated: isFinite(+lastUpdated) ? lastUpdated : null,
    };
  }, [allowed, picked]);

  const pctFree =
    view.total > 0 ? Math.round((view.free / view.total) * 100) : 0;
  const pctOcc =
    view.total > 0 ? Math.round((view.occupied / view.total) * 100) : 0;

  return (
    <Wrap>
      <TopBar>
        <Title>
          <LiveDot /> Pregled zauzetosti (live)
        </Title>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <label style={{ fontSize: 13, color: "#475569" }}>
            Parking:&nbsp;
            <Select
              value={picked}
              onChange={(e) => setPicked(e.target.value)}
              aria-label="Odaberi parking"
              title="Odaberi parking"
            >
              {selectOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id === "all" ? o.name : toLabel(o.name || o.id)}
                </option>
              ))}
            </Select>
          </label>
        </div>
      </TopBar>

      <Cards>
        <Card>
          <h4>Ukupno mjesta</h4>
          <strong>{(view.total || 0).toLocaleString()}</strong>
          <Subtle>{view.label}</Subtle>
        </Card>

        <Card>
          <h4>Zauzeto</h4>
          <strong>{(view.occupied || 0).toLocaleString()}</strong>
          <Subtle>{pctOcc}% od ukupno</Subtle>
        </Card>

        <Card>
          <h4>Slobodno</h4>
          <strong>{(view.free || 0).toLocaleString()}</strong>
          <Subtle>{pctFree}% od ukupno</Subtle>
        </Card>

        <Card>
          <h4>Popunjenost</h4>
          <strong>{Math.round((view.occupancyRatio || 0) * 100)}%</strong>
          <Progress $pct={Math.round((view.occupancyRatio || 0) * 100)}>
            <span />
          </Progress>
          <Subtle>
            {isFetching
              ? "Ažuriranje…"
              : view.lastUpdated
              ? `Zadnje ažuriranje: ${view.lastUpdated.toLocaleString()}`
              : "Nema vremena ažuriranja"}
          </Subtle>
        </Card>
      </Cards>
    </Wrap>
  );
}
