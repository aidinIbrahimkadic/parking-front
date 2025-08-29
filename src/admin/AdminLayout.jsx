// src/admin/AdminLayout.jsx
import React from "react";
import styled from "styled-components";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext.jsx";
import ChangePasswordModal from "./components/ChangePasswordModal.jsx";

const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  background: #f6f7fb;
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  background: #0f172a;
  color: #cbd5e1;
  padding: 20px;
  display: grid;
  align-content: start;
  gap: 12px;

  h2 {
    color: #fff;
    font-size: 18px;
    margin: 0 0 8px;
  }
  nav {
    display: grid;
    gap: 6px;
  }
  a {
    color: #cbd5e1;
    text-decoration: none;
    padding: 8px 10px;
    border-radius: 8px;
    display: block;
  }
  a.active,
  a:hover {
    background: #1e293b;
    color: #fff;
  }
`;

const Header = styled.header`
  grid-area: header;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Main = styled.main`
  grid-area: main;
  padding: 20px;
  display: grid;
  gap: 16px;
`;

const Right = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  button {
    border: 1px solid #e2e8f0;
    background: #fff;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
  }
  button:hover {
    background: #f8fafc;
  }
`;

export default function AdminLayout() {
  const { auth, logout } = useAuth();
  const [pwdOpen, setPwdOpen] = React.useState(false);
  const nav = useNavigate();

  return (
    <Wrap>
      <Sidebar>
        <h2>Admin</h2>
        <nav>
          <NavLink to="/admin/meta">Metapodaci</NavLink>
          <NavLink to="/admin/documents">Dokumenti</NavLink>
        </nav>
      </Sidebar>

      <Header>
        <div>
          Prijavljen: <strong>{auth?.user?.email}</strong>
        </div>
        <Right>
          <button onClick={() => setPwdOpen(true)}>Promijeni lozinku</button>
          <button
            onClick={() => {
              logout();
              nav("/admin/login", { replace: true });
            }}
          >
            Odjava
          </button>
        </Right>
      </Header>

      <Main>
        <Outlet />
      </Main>

      <ChangePasswordModal open={pwdOpen} onClose={() => setPwdOpen(false)} />
    </Wrap>
  );
}
