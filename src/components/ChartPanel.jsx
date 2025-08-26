import React from "react";
import styled, { useTheme } from "styled-components";
import { Panel, Muted } from "./Layout.jsx";

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-wrap: wrap;
`;

export default function ChartPanel({ title, subtitle, actions, children }) {
  const theme = useTheme();
  return (
    <Panel>
      <Head>
        <div>
          <Title>{title}</Title>
          {subtitle ? <Muted>{subtitle}</Muted> : null}
        </div>
        {actions ? <Actions>{actions}</Actions> : null}
      </Head>
      <div style={{ width: "100%", height: 360 }}>{children}</div>
    </Panel>
  );
}
