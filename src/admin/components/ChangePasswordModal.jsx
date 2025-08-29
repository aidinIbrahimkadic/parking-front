// src/admin/components/ChangePasswordModal.jsx
import React from "react";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { adminFetch } from "../api/adminApi.js";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: ${({ open }) => (open ? "grid" : "none")};
  place-items: center;
  z-index: 1000;
`;
const Card = styled.div`
  width: 420px;
  max-width: 95vw;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 12px;
`;

export default function ChangePasswordModal({ open, onClose }) {
  const [currentPassword, setCur] = React.useState("");
  const [newPassword, setNew] = React.useState("");
  const [msg, setMsg] = React.useState("");

  const mut = useMutation({
    mutationFn: ({ currentPassword, newPassword }) =>
      adminFetch("/auth/change-password", {
        method: "POST",
        body: { currentPassword, newPassword },
      }),
    onSuccess: () => {
      setMsg("Lozinka promijenjena.");
      setCur("");
      setNew("");
      setTimeout(onClose, 900);
    },
    onError: (e) => setMsg(e.message || "Greška"),
  });

  return (
    <Backdrop open={open} onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: 0 }}>Promjena lozinke</h3>

        <label>
          <div>Trenutna lozinka</div>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCur(e.target.value)}
          />
        </label>
        <label>
          <div>Nova lozinka</div>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNew(e.target.value)}
          />
        </label>

        {msg && <div style={{ color: "#0f766e" }}>{msg}</div>}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose}>Zatvori</button>
          <button
            onClick={() => mut.mutate({ currentPassword, newPassword })}
            disabled={!currentPassword || !newPassword || mut.isPending}
          >
            {mut.isPending ? "Spremam…" : "Spremi"}
          </button>
        </div>
      </Card>
    </Backdrop>
  );
}
