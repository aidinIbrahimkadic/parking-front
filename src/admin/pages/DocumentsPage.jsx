// src/admin/pages/DocumentsPage.jsx
import React from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../api/adminApi.js";

/* ========== UI ========== */

const Panel = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 18px;
`;

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: 20px;
    letter-spacing: 0.2px;
  }
  small {
    color: #64748b;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  input,
  select {
    border: 1px solid #e2e8f0;
    background: #fff;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 14px;
    outline: none;
  }
  input:focus,
  select:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
  }

  button {
    border: 1px solid #e2e8f0;
    background: #0f172a;
    color: #fff;
    padding: 10px 14px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
  }
`;

const Row = styled.div`
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 14px;
  background: #fff;
  display: grid;
  gap: 10px;
`;

const RowHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;

  .meta {
    color: #64748b;
    font-size: 12px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  height: fit-content;

  button {
    border: 1px solid #e2e8f0;
    background: #fff;
    padding: 8px 10px;
    border-radius: 10px;
    cursor: pointer;
  }
  button:hover {
    background: #f8fafc;
  }
  .danger {
    border-color: #fecaca;
    background: #fff1f2;
  }
`;

const FormWrap = styled.div`
  border-top: 1px dashed #e5e7eb;
  padding-top: 12px;
  display: grid;
  gap: 10px;
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 13px;
  color: #334155;
`;

const Input = styled.input`
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
  }
`;

const Select = styled.select`
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
  }
`;

const Textarea = styled.textarea`
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  min-height: 96px;
  resize: vertical;
  &:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
  }
`;

const FormButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;

  button {
    border: 1px solid #e2e8f0;
    background: #0f172a;
    color: #fff;
    padding: 10px 14px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
  }
  .ghost {
    background: #fff;
    color: #0f172a;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Pager = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;

  button,
  select {
    border: 1px solid #e2e8f0;
    background: #fff;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* Spinner & Skeleton */
const Spinner = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  border-top-color: #0f172a;
  animation: spin 0.9s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Skeleton = styled.div`
  height: 16px;
  background: linear-gradient(90deg, #f4f6fa 25%, #eef2f7 37%, #f4f6fa 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
  border-radius: 8px;
  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;

/* Toast */
const ToastWrap = styled.div`
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 9999;
  display: grid;
  gap: 8px;
`;
const ToastItem = styled.div`
  min-width: 260px;
  max-width: 380px;
  background: ${({ type }) => (type === "error" ? "#991b1b" : "#0f172a")};
  color: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 10px 30px rgba(2, 8, 23, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: translateY(${({ open }) => (open ? "0" : "6px")});
  transition: opacity 0.18s ease, transform 0.18s ease;
  font-size: 14px;
`;
function useToast(timeoutMs = 2500) {
  const [toast, setToast] = React.useState(null);
  const show = React.useCallback(
    (msg, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToast({ id, type, msg, open: true });
      const t = setTimeout(() => {
        setToast((cur) => (cur?.id === id ? { ...cur, open: false } : cur));
        setTimeout(() => setToast((cur) => (cur?.id === id ? null : cur)), 200);
      }, timeoutMs);
      return () => clearTimeout(t);
    },
    [timeoutMs]
  );
  const node = toast ? (
    <ToastWrap>
      <ToastItem open={toast.open} type={toast.type}>
        {toast.msg}
      </ToastItem>
    </ToastWrap>
  ) : null;
  return { show, node };
}

/* ========== Form ========== */

function DocForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = React.useState(initial?.title || "");
  const [doc_type, setType] = React.useState(initial?.doc_type || "");
  const [description, setDesc] = React.useState(initial?.description || "");
  const [published_at, setPub] = React.useState(
    initial?.published_at
      ? new Date(initial.published_at).toISOString().slice(0, 16)
      : ""
  );
  const [file, setFile] = React.useState(null);
  const fileInputRef = React.useRef(null);

  const canSubmit = Boolean(title) && (initial ? true : Boolean(file));

  const submit = () => {
    onSubmit({ title, doc_type, description, published_at, file });
  };

  return (
    <FormWrap>
      <Field>
        <Label>Naslov *</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>

      <Field>
        <Label>Vrsta</Label>
        <Select value={doc_type} onChange={(e) => setType(e.target.value)}>
          <option value="">(nije zadano)</option>
          <option value="Odluka">Odluka</option>
          <option value="Pravilnik">Pravilnik</option>
          <option value="Uputstvo">Uputstvo</option>
        </Select>
      </Field>

      <Field>
        <Label>Opis</Label>
        <Textarea
          rows={3}
          value={description}
          onChange={(e) => setDesc(e.target.value)}
        />
      </Field>

      <Field>
        <Label>Datum objave</Label>
        <Input
          type="datetime-local"
          value={published_at}
          onChange={(e) => setPub(e.target.value)}
          className="themed-datetime"
        />
      </Field>

      <Field>
        <Label>
          Datoteka {initial ? "(ostavi prazno ako ne mijenjaš)" : "*"}
        </Label>
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file?.name ? (
          <small style={{ color: "#64748b" }}>{file.name}</small>
        ) : null}
      </Field>

      <FormButtons>
        <button onClick={submit} disabled={!canSubmit}>
          Spremi
        </button>
        <button type="button" className="ghost" onClick={onCancel}>
          Odustani
        </button>
      </FormButtons>
    </FormWrap>
  );
}

/* ========== Page ========== */

export default function DocumentsPage() {
  const qc = useQueryClient();
  const { show, node: toast } = useToast();

  const [q, setQ] = React.useState("");
  const [doc_type, setType] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [editing, setEditing] = React.useState(null);
  const [showCreate, setShowCreate] = React.useState(false);

  const docsQuery = useQuery({
    queryKey: ["docs-admin", { q, doc_type, page }],
    queryFn: () => listDocuments({ q, doc_type, page, pageSize: 10 }),
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: "always", // ← da sigurno povuče na prvi ulazak
    refetchOnWindowFocus: false,
    placeholderData: { rows: [], total: 0, page: 1, pageSize: 10 },
  });

  const mutCreate = useMutation({
    mutationFn: (payload) => createDocument(payload),
    onSuccess: () => {
      setShowCreate(false);
      show("Dokument dodan.");
      qc.invalidateQueries({ queryKey: ["docs-admin"] });
    },
    onError: (e) =>
      show(e?.message || "Greška pri dodavanju dokumenta.", "error"),
  });

  const mutUpdate = useMutation({
    mutationFn: ({ id, payload }) => updateDocument(id, payload),
    onSuccess: () => {
      setEditing(null);
      show("Dokument ažuriran.");
      qc.invalidateQueries({ queryKey: ["docs-admin"] });
    },
    onError: (e) =>
      show(e?.message || "Greška pri ažuriranju dokumenta.", "error"),
  });

  const mutDelete = useMutation({
    mutationFn: (id) => deleteDocument(id),
    onSuccess: () => {
      show("Dokument obrisan.");
      qc.invalidateQueries({ queryKey: ["docs-admin"] });
    },
    onError: (e) =>
      show(e?.message || "Greška pri brisanju dokumenta.", "error"),
  });

  const rows = docsQuery.data?.rows ?? [];
  const total = docsQuery.data?.total ?? 0;
  const pageSize = docsQuery.data?.pageSize ?? 10;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <Panel>
        <div>
          <Head>
            <h3>Dokumenti</h3>
            {docsQuery.isFetching ? (
              <Spinner />
            ) : (
              <small>Ukupno: {total}</small>
            )}
          </Head>

          <Toolbar>
            <input
              placeholder="Pretraga…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
            <select
              value={doc_type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Sve vrste</option>
              <option value="Odluka">Odluka</option>
              <option value="Pravilnik">Pravilnik</option>
              <option value="Uputstvo">Uputstvo</option>
            </select>

            <span style={{ marginLeft: "auto" }} />
            <button
              onClick={() => {
                setShowCreate((s) => !s);
                setEditing(null);
              }}
            >
              {showCreate ? "Zatvori" : "Dodaj dokument"}
            </button>
          </Toolbar>
        </div>

        {showCreate && (
          <Row>
            <strong>Novi dokument</strong>
            <DocForm
              onSubmit={(payload) => mutCreate.mutate(payload)}
              onCancel={() => setShowCreate(false)}
            />
          </Row>
        )}

        {/* Initial state / skeleton */}
        {docsQuery.isLoading && rows.length === 0 ? (
          <>
            <Row>
              <Skeleton style={{ width: "40%" }} />
              <Skeleton />
              <Skeleton style={{ width: "60%" }} />
            </Row>
            <Row>
              <Skeleton style={{ width: "50%" }} />
              <Skeleton />
              <Skeleton style={{ width: "30%" }} />
            </Row>
          </>
        ) : rows.length === 0 ? (
          <div style={{ color: "#64748b" }}>
            {docsQuery.isFetching ? "Učitavanje…" : "Nema dokumenata."}
          </div>
        ) : (
          rows.map((d) => (
            <Row key={d.id}>
              <RowHead>
                <div>
                  <strong>{d.title}</strong>
                  <div className="meta">
                    {d.doc_type || "—"} • Objavljeno:{" "}
                    {d.published_at
                      ? new Date(d.published_at).toLocaleString()
                      : "—"}
                  </div>
                </div>
                <Actions>
                  <button
                    onClick={() => {
                      setEditing(d);
                      setShowCreate(false);
                    }}
                  >
                    Uredi
                  </button>
                  <button
                    className="danger"
                    onClick={() => {
                      if (confirm("Obrisati dokument?")) mutDelete.mutate(d.id);
                    }}
                  >
                    Obriši
                  </button>
                </Actions>
              </RowHead>

              {d.description && (
                <div style={{ color: "#334155" }}>{d.description}</div>
              )}
              {d.file_url && (
                <div>
                  <a href={d.file_url} target="_blank" rel="noreferrer">
                    Otvori datoteku
                  </a>
                </div>
              )}

              {editing?.id === d.id && (
                <DocForm
                  initial={d}
                  onSubmit={(payload) =>
                    mutUpdate.mutate({ id: d.id, payload })
                  }
                  onCancel={() => setEditing(null)}
                />
              )}
            </Row>
          ))
        )}

        <Pager>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ←
          </button>
          <span>
            Strana {page} / {maxPage}
          </span>
          <button
            disabled={page >= maxPage}
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
          >
            →
          </button>
        </Pager>
      </Panel>

      {toast}
    </>
  );
}
