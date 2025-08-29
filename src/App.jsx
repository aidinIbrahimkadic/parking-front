import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./hooks/queryClient.js";

import PublicDashboard from "./pages/PublicDashboard.jsx";
import Login from "./admin/pages/Login.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import ProtectedRoute from "./admin/auth/ProtectedRoute.jsx";

// PRILAGODI OVE IMPORT-e nazivima tvojih admin stranica:
import MetaPage from "./admin/pages/MetaPage.jsx";
import DocumentsPage from "./admin/pages/DocumentsPage.jsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./admin/auth/AuthContext.jsx";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PublicDashboard />} />
              <Route path="/login" element={<Login />} />

              {/* ADMIN NESTED */}
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="meta" replace />} />
                  <Route path="meta" element={<MetaPage />} />
                  <Route path="documents" element={<DocumentsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
