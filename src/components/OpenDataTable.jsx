import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  useParkings,
  useSnapshots,
  getApiUrlLast,
  getApiUrlHistory,
  getExportUrlLast,
  getExportUrlHistory,
} from "../hooks/api.js";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import CopyButton from "./CopyButton.jsx";
import ParkingChips from "./ParkingChips.jsx";
import {
  allowedParkingIds,
  displayNameMap,
} from "../config/allowedParkings.js";

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
`;

const Header = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
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

const Toolbar = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 12px;
`;

const ControlsCard = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const DateInput = styled(Input)`
  &::-webkit-datetime-edit,
  &::-webkit-datetime-edit-fields-wrapper,
  &::-webkit-datetime-edit-text,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-year-field,
  &::-webkit-datetime-edit-hour-field,
  &::-webkit-datetime-edit-minute-field,
  &::-webkit-datetime-edit-second-field,
  &::-webkit-datetime-edit-ampm-field {
    color: #0f172a;
  }
  &::-webkit-calendar-picker-indicator {
    opacity: 0.9;
    cursor: pointer;
    filter: invert(28%) sepia(62%) saturate(1800%) hue-rotate(235deg)
      brightness(96%) contrast(96%);
    transition: opacity 120ms ease, filter 120ms ease;
  }
  &:hover::-webkit-calendar-picker-indicator {
    opacity: 1;
    filter: invert(25%) sepia(68%) saturate(2200%) hue-rotate(235deg)
      brightness(100%) contrast(100%);
  }
  &:active::-webkit-calendar-picker-indicator {
    filter: invert(18%) sepia(90%) saturate(2600%) hue-rotate(235deg)
      brightness(95%) contrast(104%);
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
  color: #333333;
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

const LinkButton = styled.a`
  text-decoration: none;
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

const ExportBar = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const TableCard = styled.div`
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.05);
`;

const TableWrap = styled.div`
  overflow: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  th,
  td {
    padding: 12px 10px;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
  }
  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    text-align: left;
    font-weight: 600;
    background: linear-gradient(180deg, #fafafa, #f5f7fb);
  }
  tbody tr:hover td {
    background: #fcfcfd;
  }
  th.sortable {
    cursor: pointer;
  }
  th.sortable .carat {
    opacity: 0.65;
    margin-left: 6px;
  }
`;

const Footer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #eef2f7;
  background: #fafcff;
`;

const col = createColumnHelper();

/* ======= komponenta ======= */
export default function OpenDataTable() {
  // filter: samo 3 dozvoljena (default: sva tri)
  const [picked, setPicked] = useState(allowedParkingIds.map(String));

  // range: kad je setovan from/to → “Historija (period)”, inače “Zadnje stanje”
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // list params (zadnje stanje)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100); // odmah 100 redova
  const [order, setOrder] = useState("desc"); // sort samo po createdAt

  // history params (server-side iz /snapshots)
  const [hPage, setHPage] = useState(1);
  const [hPageSize, setHPageSize] = useState(100);
  const [hOrder, setHOrder] = useState("desc");

  const parkingIdIn = useMemo(() => picked.filter(Boolean).join(","), [picked]);
  const isHistory = Boolean(from || to);

  // FETCH (LAST)
  const { data: lastData, isFetching: fetchingLast } = useParkings({
    page,
    pageSize,
    sort: "createdAt",
    order,
    parkingIdIn,
  });

  // FETCH (HISTORY)
  const historyParams = useMemo(() => {
    const out = {
      parkingIdIn,
      page: hPage,
      pageSize: hPageSize,
      order: hOrder,
    };
    if (from) out.from = new Date(from).toISOString();
    if (to) out.to = new Date(to).toISOString();
    return out;
  }, [parkingIdIn, hPage, hPageSize, hOrder, from, to]);

  const { data: historyData, isFetching: fetchingHistory } =
    useSnapshots(historyParams);

  // COLUMNS (bez specijalnih mjesta)
  const columns = useMemo(
    () => [
      col.accessor("parkingName", {
        header: "Naziv parkinga",
        cell: (i) => i.getValue(),
      }),
      col.accessor("numberOfParkingPlaces", { header: "Ukupno mjesta" }),
      col.accessor("totalNumberOfRegularPlaces", { header: "Ukupno (reg.)" }),
      col.accessor("freeNumberOfRegularPlaces", { header: "Slobodno (reg.)" }),
      col.accessor("createdAt", {
        header: "Ažurirano",
        cell: (i) => new Date(i.getValue()).toLocaleString(),
      }),
    ],
    []
  );

  // DATA
  const rows = isHistory ? historyData?.rows ?? [] : lastData?.rows ?? [];
  const total = isHistory ? historyData?.total ?? 0 : lastData?.total ?? 0;
  const curPage = isHistory ? hPage : page;
  const curPageSize = isHistory ? hPageSize : pageSize;

  // sort samo po “Ažurirano”
  const sortingState = useMemo(
    () => [{ id: "createdAt", desc: (isHistory ? hOrder : order) !== "asc" }],
    [isHistory, order, hOrder]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting: sortingState },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  const totalPages = Math.max(1, Math.ceil(total / curPageSize));

  const toggleCreatedAtSort = () => {
    if (isHistory) setHOrder((o) => (o === "asc" ? "desc" : "asc"));
    else setOrder((o) => (o === "asc" ? "desc" : "asc"));
    if (isHistory) setHPage(1);
    else setPage(1);
  };

  const allOptions = allowedParkingIds.map((id) => ({
    value: String(id),
    label:
      displayNameMap[id] ||
      (id === "66"
        ? "Dom"
        : id === "67"
        ? "Haustor"
        : id === "70"
        ? "Musala"
        : `Parking ${id}`),
  }));

  // kad se promijeni izbor parkinga – reset paginacija
  const onPickChange = (vals) => {
    setPicked(vals);
    setPage(1);
    setHPage(1);
  };

  // EXPORT (svi redovi po filteru)
  const apiHref = isHistory
    ? getApiUrlHistory({ ...historyParams, page: 1, pageSize: 10000 })
    : getApiUrlLast({
        parkingIdIn,
        page: 1,
        pageSize: 2000,
        sort: "createdAt",
        order,
      });

  const csvHref = isHistory
    ? getExportUrlHistory({ ...historyParams, page: 1, pageSize: 10000 }, "csv")
    : getExportUrlLast({ parkingIdIn, sort: "createdAt", order }, "csv");

  const jsonHref = isHistory
    ? getExportUrlHistory(
        { ...historyParams, page: 1, pageSize: 10000 },
        "json"
      )
    : getExportUrlLast({ parkingIdIn, sort: "createdAt", order }, "json");

  const xlsxHref = isHistory
    ? getExportUrlHistory(
        { ...historyParams, page: 1, pageSize: 10000 },
        "xlsx"
      )
    : getExportUrlLast({ parkingIdIn, sort: "createdAt", order }, "xlsx");

  return (
    <Shell>
      <Header>
        <Icon>📊</Icon>
        <Title>Open data – tabela</Title>
        <Badge>
          Mod:{" "}
          <strong>{isHistory ? "Historija (period)" : "Zadnje stanje"}</strong>
        </Badge>
      </Header>

      <Toolbar>
        <ControlsCard>
          <Row>
            <Label>Parking:</Label>
            <ParkingChips
              options={allOptions}
              value={picked}
              onChange={onPickChange}
            />

            <Label>
              Od:
              <DateInput
                type="datetime-local"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setHPage(1);
                }}
                aria-label="Od (datum i vrijeme)"
              />
            </Label>

            <Label>
              Do:
              <DateInput
                type="datetime-local"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setHPage(1);
                }}
                aria-label="Do (datum i vrijeme)"
              />
            </Label>

            {(from || to) && (
              <GhostButton
                onClick={() => {
                  setFrom("");
                  setTo("");
                  setHPage(1);
                }}
              >
                Reset perioda
              </GhostButton>
            )}

            <span style={{ marginLeft: "auto" }}>
              <CopyButton text={apiHref}>Kopiraj API link</CopyButton>
            </span>
          </Row>

          <Row style={{ justifyContent: "space-between" }}>
            <ExportBar>
              <LinkButton href={apiHref} target="_blank" rel="noreferrer">
                Otvori API
              </LinkButton>
              <LinkButton href={csvHref}>CSV</LinkButton>
              <LinkButton href={jsonHref}>JSON</LinkButton>
              <LinkButton href={xlsxHref}>XLSX</LinkButton>
            </ExportBar>

            {!isHistory ? (
              <Row>
                <Badge>Redova po strani</Badge>
                <Select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(+e.target.value);
                    setPage(1);
                  }}
                >
                  {[50, 100, 150, 200].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </Row>
            ) : (
              <Row>
                <Badge>Redova po strani</Badge>
                <Select
                  value={hPageSize}
                  onChange={(e) => {
                    setHPageSize(+e.target.value);
                    setHPage(1);
                  }}
                >
                  {[50, 100, 200, 500].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </Row>
            )}
          </Row>
        </ControlsCard>
      </Toolbar>

      <TableCard>
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Naziv parkinga</th>
                <th>Ukupno mjesta</th>
                <th>Ukupno (reg.)</th>
                <th>Slobodno (reg.)</th>
                <th
                  className="sortable"
                  onClick={toggleCreatedAtSort}
                  title="Sortiraj po Ažurirano"
                >
                  Ažurirano
                  <span className="carat">
                    {((isHistory ? hOrder : order) === "asc" && "▲") ||
                      ((isHistory ? hOrder : order) === "desc" && "▼") ||
                      ""}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 12, textAlign: "center" }}>
                    {(isHistory ? fetchingHistory : fetchingLast)
                      ? "Učitavanje…"
                      : "Nema podataka"}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrap>

        <Footer>
          <GhostButton
            disabled={(isHistory ? hPage : page) <= 1}
            onClick={() =>
              isHistory ? setHPage((p) => p - 1) : setPage((p) => p - 1)
            }
          >
            ←
          </GhostButton>
          <span>
            Strana {curPage} / {Math.max(1, totalPages)}
          </span>
          <GhostButton
            disabled={curPage >= totalPages}
            onClick={() =>
              isHistory ? setHPage((p) => p + 1) : setPage((p) => p + 1)
            }
          >
            →
          </GhostButton>
        </Footer>
      </TableCard>
    </Shell>
  );
}
