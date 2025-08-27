// src/components/ExportBar.jsx
import React from "react";
import CopyButton from "./CopyButton.jsx";
import {
  getApiUrlLast,
  getApiUrlHistory,
  getExportUrlLast,
  getExportUrlHistory,
} from "../hooks/api.js";

export default function ExportBar({ mode = "last", filters = {} }) {
  const apiHref =
    mode === "history" ? getApiUrlHistory(filters) : getApiUrlLast(filters);

  const csvHref =
    mode === "history"
      ? getExportUrlHistory(filters, "csv")
      : getExportUrlLast(filters, "csv");
  const jsonHref =
    mode === "history"
      ? getExportUrlHistory(filters, "json")
      : getExportUrlLast(filters, "json");
  const xlsxHref =
    mode === "history"
      ? getExportUrlHistory(filters, "xlsx")
      : getExportUrlLast(filters, "xlsx");
  const xmlHref =
    mode === "history"
      ? getExportUrlHistory(filters, "xml")
      : getExportUrlLast(filters, "xml");

  return (
    <div style={{ display: "flex", gap: 10, margin: "6px 0 10px" }}>
      <a href={apiHref} target="_blank" rel="noreferrer">
        API
      </a>
      <a href={csvHref}>CSV</a>
      <a href={jsonHref}>JSON</a>
      <a href={xlsxHref}>XLSX</a>
      <a href={xmlHref}>XML</a>
      <CopyButton text={apiHref}>Kopiraj API</CopyButton>
    </div>
  );
}
