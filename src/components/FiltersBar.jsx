import styled from "styled-components";
import { Panel, HStack } from "./Layout.jsx";

const Input = styled.input`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radii.sm};
  outline: none;
  min-width: 220px;
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radii.sm};
  outline: none;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export default function FiltersBar({
  filters,
  zones,
  types,
  onChange,
  onClear,
}) {
  return (
    <Panel>
      <HStack>
        <Input
          type="search"
          placeholder="Pretraga (naziv/adresa)…"
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
        />

        <Select
          value={filters.zoneName}
          onChange={(e) => onChange({ zoneName: e.target.value })}
        >
          <option value="">Sve zone</option>
          {zones.map((z) => (
            <option key={z || "_"} value={z}>
              {z || "(n/a)"}
            </option>
          ))}
        </Select>

        <Select
          value={filters.parkingTypeId}
          onChange={(e) => onChange({ parkingTypeId: e.target.value })}
        >
          <option value="">Svi tipovi</option>
          {types.map((t) => (
            <option key={t || "_"} value={t}>
              {t || "(n/a)"}
            </option>
          ))}
        </Select>

        <Input
          type="number"
          min={0}
          placeholder="Min. slobodnih"
          value={filters.minFree}
          onChange={(e) =>
            onChange({
              minFree: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          style={{ width: 160 }}
        />

        <Button onClick={onClear}>Reset</Button>
      </HStack>
    </Panel>
  );
}
