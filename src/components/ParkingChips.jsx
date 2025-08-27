import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const Chip = styled.button`
  appearance: none;
  border: 1px solid ${({ active }) => (active ? "#c7d2fe" : "#e2e8f0")};
  background: ${({ active }) =>
    active ? "linear-gradient(135deg, #eef2ff, #f0f9ff)" : "#fff"};
  color: #0f172a;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
  transition: 140ms ease;
  box-shadow: ${({ active }) =>
    active ? "0 6px 14px rgba(99,102,241,.12)" : "0 2px 6px rgba(2,6,23,.05)"};

  &:hover {
    background: ${({ active }) =>
      active ? "linear-gradient(135deg, #e5e7ff, #e6f7ff)" : "#f8fafc"};
  }
`;

const Small = styled.button`
  appearance: none;
  border: 1px dashed #e2e8f0;
  background: #fff;
  color: #334155;
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 12px;
  cursor: pointer;
  transition: 140ms ease;
  &:hover {
    background: #f8fafc;
  }
`;

export default function ParkingChips({ options = [], value = [], onChange }) {
  const toggle = (val) => {
    const set = new Set(value);
    if (set.has(val)) set.delete(val);
    else set.add(val);

    // ne dozvoli prazan set – vrati sve
    const next = Array.from(set);
    onChange(next.length ? next : options.map((o) => o.value));
  };

  const selectAll = () => onChange(options.map((o) => o.value));

  return (
    <Wrap>
      {options.map((opt) => (
        <Chip
          key={opt.value}
          type="button"
          active={value.includes(opt.value)}
          onClick={() => toggle(opt.value)}
          aria-pressed={value.includes(opt.value)}
        >
          {opt.label}
        </Chip>
      ))}
      <Small type="button" onClick={selectAll}>
        Sve
      </Small>
    </Wrap>
  );
}
