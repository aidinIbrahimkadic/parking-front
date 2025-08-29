import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root { color-scheme: dark; }
* { box-sizing: border-box; }
html, body, #root { height: 100%; }
body {  
margin: 0;
padding: 0;
background: ${({ theme }) => theme.colors.bg};
color: ${({ theme }) => theme.colors.text};
font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}
a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }

input[type="datetime-local"].themed-datetime {
  color-scheme: light;
  accent-color: #334155;
}
`;

export const Shell = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(4)};
  display: grid;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.panel};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing(4)};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const HStack = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  flex-wrap: wrap;
`;

export const VStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const Muted = styled.span`
  color: ${({ theme }) => theme.colors.subtext};
`;
