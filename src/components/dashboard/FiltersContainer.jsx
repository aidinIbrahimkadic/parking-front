import React from "react";
import { useQuery } from "@tanstack/react-query";
import FiltersBar from "../FiltersBar.jsx";
import { fetchParkingsForFilters } from "../../api/client.js";

export default function FiltersContainer({ filters, onChange }) {
  const { data: parkingsForFilters } = useQuery({
    queryKey: ["parkings-filter-meta", filters],
    queryFn: () => fetchParkingsForFilters(filters),
  });

  const zones = React.useMemo(() => {
    const set = new Set();
    if (parkingsForFilters?.rows) {
      for (const r of parkingsForFilters.rows) set.add(r.zoneName || "");
    }
    return Array.from(set).sort();
  }, [parkingsForFilters]);

  const types = React.useMemo(() => {
    const set = new Set();
    if (parkingsForFilters?.rows) {
      for (const r of parkingsForFilters.rows) set.add(r.parkingTypeId || "");
    }
    return Array.from(set).sort();
  }, [parkingsForFilters]);

  const onChangeFilters = (patch) =>
    onChange((prev) => ({ ...prev, ...patch }));
  const onClearFilters = () =>
    onChange({ q: "", zoneName: "", parkingTypeId: "", minFree: "" });

  return (
    <FiltersBar
      filters={filters}
      zones={zones}
      types={types}
      onChange={onChangeFilters}
      onClear={onClearFilters}
    />
  );
}
