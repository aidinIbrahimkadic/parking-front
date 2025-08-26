import React from "react";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
  flex-wrap: wrap;
`;

export default function ParkingPicker({ options = [], value = "", onChange }) {
  return (
    <Row>
      <label style={{ fontWeight: 600 }}>Parking:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: 8, borderRadius: 8 }}
      >
        <option value="">— Odaberi parking —</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Row>
  );
}
