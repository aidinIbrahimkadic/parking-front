import React from "react";
import styled from "styled-components";
import { useMetadata, useByParking, useOverview } from "../hooks/api.js";
import { allowedParkingIds } from "../config/allowedParkings.js";

const Wrap = styled.section`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: 18px;
  background: radial-gradient(
      1200px 240px at -20% -20%,
      rgba(99, 102, 241, 0.1),
      transparent 60%
    ),
    radial-gradient(
      1200px 240px at 120% 120%,
      rgba(34, 197, 94, 0.1),
      transparent 60%
    ),
    linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.06);
  margin-bottom: 1rem;
`;

const Header = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 6px;
`;

const Icon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #6366f1, #22c55e);
  color: white;
  font-size: 18px;
  box-shadow: 0 8px 20px rgba(2, 6, 23, 0.15);
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  color: #0f172a;
  letter-spacing: 0.2px;
`;

const Desc = styled.p`
  margin: 8px 0 12px;
  color: #334155;
  line-height: 1.55;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: #0f172a;
  background: #eef2ff;
  border: 1px solid #e0e7ff;
`;

const BadgeGreen = styled(Badge)`
  background: #ecfdf5;
  border-color: #d1fae5;
`;

const Muted = styled.span`
  color: #64748b;
  font-size: 12px;
`;

export default function MetadataBanner({ filters = {} }) {
  // 1) Metapodaci (naslov/opis/licenca/fields)
  const { data: meta } = useMetadata();
  // 2) Last updated iz istog skupa kao “live”:
  //    ograničavamo na Haustor/Dom/Musala preko parkingIdIn
  const filtered = React.useMemo(
    () => ({
      ...filters,
      parkingIdIn: allowedParkingIds.join(","), // forsiramo samo 3 parkinga
    }),
    [filters]
  );

  // /stats/by-parking vraća createdAt po parkingu (zadnji snapshot)
  const { data: byParking } = useByParking(filtered);

  // Fallback: /stats/overview (ako byParking nije stigao)
  const { data: overview } = useOverview(filtered);

  const title = meta?.title || "Open Data – Parking zauzetost";
  const description =
    meta?.description ||
    "Petnaestominutni zapisi zauzetosti javnih parkinga (broj mjesta, slobodna mjesta, zauzetost).";
  // const license = meta?.license || "—";
  const fieldsCount = Array.isArray(meta?.fields) ? meta.fields.length : 0;

  // Uskladi s “live”: max(createdAt) preko tri parkinga
  const lastFromBy = React.useMemo(() => {
    if (!Array.isArray(byParking) || byParking.length === 0) return null;
    const onlyAllowed = byParking.filter((p) =>
      allowedParkingIds.includes(String(p.parkingId))
    );
    if (!onlyAllowed.length) return null;
    const maxTs = Math.max(
      ...onlyAllowed.map((r) => +new Date(r.createdAt || 0))
    );
    return Number.isFinite(maxTs) ? new Date(maxTs).toLocaleString() : null;
  }, [byParking]);

  const last =
    lastFromBy ||
    (overview?.lastUpdated
      ? new Date(overview.lastUpdated).toLocaleString()
      : "—");

  return (
    <Wrap>
      <Header>
        <Icon>🗂️</Icon>
        <Title>{title}</Title>
      </Header>

      {description ? <Desc>{description}</Desc> : null}

      <MetaRow>
        <span>Kontakt: {meta?.contact_email}</span>
      </MetaRow>
      <MetaRow>
        <Badge>
          Zadnje ažuriranje podataka: <strong>{last}</strong>
        </Badge>
      </MetaRow>
    </Wrap>
  );
}
