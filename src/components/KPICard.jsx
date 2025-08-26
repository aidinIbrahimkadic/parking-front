import styled from "styled-components";
import { Panel, Muted } from "./Layout.jsx";

const CardWrap = styled(Panel)`
  padding: ${({ theme }) => theme.spacing(3)};
`;

const Title = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.subtext};
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
`;

export default function KPICard({ title, value, suffix, hint }) {
  return (
    <CardWrap>
      <Title>{title}</Title>
      <Value>
        {value}
        {suffix ? <Muted> {suffix}</Muted> : null}
      </Value>
      {hint ? <Muted>{hint}</Muted> : null}
    </CardWrap>
  );
}
