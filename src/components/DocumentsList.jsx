// src/components/DocumentsList.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useDocuments } from "../hooks/api.js";

/* ======= stil ======= */
const Shell = styled.section`
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
  display: grid;
  gap: 14px;
`;

const Header = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
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

const ControlsCard = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.05);
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  font-size: 13px;
`;

const Input = styled.input`
  height: 36px;
  padding: 0 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  outline: none;
  min-width: 260px;
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const Select = styled.select`
  min-height: 36px;
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  outline: none;
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
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
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
  @media (max-width: 1100px) {
    grid-template-columns: repeat(6, 1fr);
  }
  @media (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Card = styled.article`
  grid-column: span 6;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.05);
  display: grid;
  gap: 6px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 10px;
`;

const DocTitle = styled.strong`
  color: #0f172a;
  font-weight: 700;
`;

const TypePill = styled.span`
  align-self: start;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #0f172a;
`;

const Meta = styled.small`
  color: #64748b;
`;

const Desc = styled.div`
  color: #334155;
`;

const LinkButton = styled.a`
  align-self: start;
  text-decoration: none;
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: 120ms ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  &:hover {
    background: #f8fafc;
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 6px;
`;

/* ======= komponenta ======= */
export default function DocumentsList() {
  const [q, setQ] = useState("");
  const [doc_type, setDocType] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 10;
  const { data, isFetching } = useDocuments({ q, doc_type, page, pageSize });
  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;

  const hasNext = page * pageSize < total;

  return (
    <Shell>
      <Header>
        <Icon>📄</Icon>
        <Title>Dokumenti (Odluke, Pravilnici, Uputstva)</Title>
        <Badge>Ukupno: {total}</Badge>
      </Header>

      <ControlsCard>
        <Row>
          <Label>
            Pretraga:
            <Input
              placeholder="Pretraga dokumenata…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              aria-label="Pretraga dokumenata"
            />
          </Label>

          <Label>
            Vrsta:
            <Select
              value={doc_type}
              onChange={(e) => {
                setDocType(e.target.value);
                setPage(1);
              }}
              aria-label="Vrsta dokumenta"
            >
              <option value="">Sve vrste</option>
              <option value="Odluka">Odluka</option>
              <option value="Pravilnik">Pravilnik</option>
              <option value="Uputstvo">Uputstvo</option>
            </Select>
          </Label>

          <span style={{ marginLeft: "auto" }}>
            {isFetching ? <Meta>Učitavanje…</Meta> : null}
          </span>
        </Row>
      </ControlsCard>

      {rows.length === 0 && !isFetching ? (
        <Meta>Nema rezultata za zadate filtere.</Meta>
      ) : (
        <Cards>
          {rows.map((d) => {
            const key = d.id ?? d.slug ?? `${d.title}-${d.published_at}`;
            const published = d.published_at
              ? new Date(d.published_at).toLocaleString()
              : "—";
            return (
              <Card key={key}>
                <TitleRow>
                  <DocTitle>{d.title}</DocTitle>
                  <TypePill>{d.doc_type || "Dokument"}</TypePill>
                </TitleRow>
                <Meta>Objavljeno: {published}</Meta>
                {d.description ? <Desc>{d.description}</Desc> : null}
                {d.file_url && (
                  <LinkButton
                    href={d.file_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Otvori datoteku
                  </LinkButton>
                )}
              </Card>
            );
          })}
        </Cards>
      )}

      <Footer>
        <GhostButton disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          ←
        </GhostButton>
        <span>
          Strana {page} / {Math.max(1, Math.ceil(total / pageSize))}
        </span>
        <GhostButton disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
          →
        </GhostButton>
      </Footer>
    </Shell>
  );
}
