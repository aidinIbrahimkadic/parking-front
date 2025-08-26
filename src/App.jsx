import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme.js";
import { GlobalStyle, Shell } from "./components/Layout.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./hooks/queryClient.js";
import PublicDashboard from "./pages/PublicDashboard.jsx";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <Shell>
          <PublicDashboard />
        </Shell>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
