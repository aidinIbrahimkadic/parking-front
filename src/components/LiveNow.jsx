import React from "react";
import styled from "styled-components";
import { Panel, Muted } from "./Layout.jsx";
import { formatDistanceToNow } from "date-fns";
import { bs } from "date-fns/locale"; // ili import { enGB as bs } ako nema bs

const Wrap = styled(Panel)`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing(3)};
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing(3)};
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.05rem;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.8rem;
  background: ${({ $bg }) => $bg || "transparent"};
  color: #0b1220;
  font-weight: 700;
`;

const Big = styled.div`
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
`;

const Small = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.subtext};
`;

export default function LiveNow({ items = [], displayNameMap = {} }) {
  if (!items?.length) {
    return (
      <Panel>
        <Muted>Nema aktivnih parkinga za prikaz.</Muted>
      </Panel>
    );
  }

  return (
    <Wrap>
      {items.map((p) => {
        const total = p.numberOfParkingPlaces ?? 0;
        const free = p.freeTotal ?? 0;
        const occPct = total ? Math.round(((total - free) / total) * 100) : 0;
        const prettyName = displayNameMap[p.parkingName] || p.parkingName;

        return (
          <Card key={p.parkingId}>
            <div>
              <Title>{prettyName}</Title>
              <Small>
                {p.parkingAddress ? `${p.parkingAddress} · ` : ""}
                <Muted>
                  ažurirano prije{" "}
                  {p.createdAt
                    ? formatDistanceToNow(new Date(p.createdAt), {
                        addSuffix: false,
                        locale: bs,
                      })
                    : "n/a"}
                </Muted>
              </Small>
            </div>
            <Tag $bg={p.zoneColor || "#fff"}>{p.zoneName || "Zona"}</Tag>

            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                gap: 16,
                alignItems: "baseline",
              }}
            >
              <Big>{free}</Big>
              <Small>
                slobodna / {total} ukupno · {occPct}% zauzeće
              </Small>
            </div>
          </Card>
        );
      })}
    </Wrap>
  );
}
