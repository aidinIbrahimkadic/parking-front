// import React from "react";
// import styled from "styled-components";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { AdminAPI } from "../api/adminApi.js";

// const Panel = styled.section`
//   background: #fff;
//   border: 1px solid #e5e7eb;
//   border-radius: 12px;
//   padding: 16px;
//   display: grid;
//   gap: 14px;
// `;

// const Head = styled.div`
//   display: flex;
//   align-items: baseline;
//   justify-content: space-between;
//   gap: 12px;
//   h3 {
//     margin: 0;
//     font-size: 18px;
//   }
//   small {
//     color: #64748b;
//   }
// `;

// const Form = styled.form`
//   display: grid;
//   gap: 12px;

//   label {
//     display: grid;
//     gap: 6px;
//   }

//   input[type="text"],
//   textarea {
//     border: 1px solid #e2e8f0;
//     background: #fff;
//     border-radius: 10px;
//     padding: 10px 12px;
//     font-size: 14px;
//     outline: none;
//   }
//   textarea {
//     min-height: 90px;
//     resize: vertical;
//   }

//   .row {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 12px;
//   }

//   button {
//     justify-self: start;
//     border: 1px solid #e2e8f0;
//     background: #0f172a;
//     color: #fff;
//     padding: 10px 14px;
//     border-radius: 10px;
//     cursor: pointer;
//     font-weight: 600;
//   }
//   button:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }
// `;

// export default function MetaPage() {
//   const qc = useQueryClient();

//   // 1) Hookovi uvijek na vrhu — bez uslovnog pozivanja
//   const metaQuery = useQuery({
//     queryKey: ["admin-meta"],
//     queryFn: AdminAPI.getMeta,
//     staleTime: 30_000,
//   });

//   const saveMutation = useMutation({
//     mutationFn: AdminAPI.updateMeta,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["admin-meta"] });
//     },
//   });

//   // 2) Lokalni form state
//   const [form, setForm] = React.useState({
//     title: "",
//     description: "",
//     license: "",
//     contact_email: "",
//     public_base_url: "",
//   });

//   // 3) Sync kada stignu podaci (oprez da ne “pleše” forma — init-once)
//   React.useEffect(() => {
//     if (metaQuery.data) {
//       const d = metaQuery.data;
//       setForm((prev) => ({
//         ...prev,
//         title: d.title ?? "",
//         description: d.description ?? "",
//         license: d.license ?? "",
//         contact_email: d.contact_email ?? "",
//         public_base_url: d.public_base_url ?? "",
//       }));
//     }
//   }, [metaQuery.data]);

//   // 4) Render (hookovi već gore — ovdje je bezbjedno granati)
//   if (metaQuery.isLoading) {
//     return <Panel>Učitavanje metapodataka…</Panel>;
//   }
//   if (metaQuery.isError) {
//     return (
//       <Panel>
//         <div style={{ color: "#b91c1c" }}>
//           Greška: {(metaQuery.error && metaQuery.error.message) || "Neuspjelo"}
//         </div>
//       </Panel>
//     );
//   }

//   const lastUpdated = metaQuery.data?.last_updated
//     ? new Date(metaQuery.data.last_updated).toLocaleString()
//     : "—";

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   const onSubmit = (e) => {
//     e.preventDefault();
//     saveMutation.mutate(form);
//   };

//   return (
//     <Panel>
//       <Head>
//         <div>
//           <h3>Metapodaci</h3>
//           <small>Zadnje ažuriranje: {lastUpdated}</small>
//         </div>
//         {saveMutation.isSuccess ? (
//           <small style={{ color: "#0f766e" }}>Sačuvano.</small>
//         ) : null}
//       </Head>

//       <Form onSubmit={onSubmit}>
//         <label>
//           <span>Naslov skupa</span>
//           <input
//             type="text"
//             name="title"
//             value={form.title}
//             onChange={onChange}
//             placeholder="npr. Open Data – Parking Tešanj"
//           />
//         </label>

//         <label>
//           <span>Opis</span>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={onChange}
//             placeholder="Kratki opis skupa podataka…"
//           />
//         </label>

//         <div className="row">
//           <label>
//             <span>Licenca</span>
//             <input
//               type="text"
//               name="license"
//               value={form.license}
//               onChange={onChange}
//               placeholder="npr. CC BY 4.0"
//             />
//           </label>
//           <label>
//             <span>Kontakt email</span>
//             <input
//               type="text"
//               name="contact_email"
//               value={form.contact_email}
//               onChange={onChange}
//               placeholder="kontakt@primjer.ba"
//             />
//           </label>
//         </div>

//         <label>
//           <span>Public base URL</span>
//           <input
//             type="text"
//             name="public_base_url"
//             value={form.public_base_url}
//             onChange={onChange}
//             placeholder="https://opendata.tesanj.ba"
//           />
//         </label>

//         <button type="submit" disabled={saveMutation.isLoading}>
//           {saveMutation.isLoading ? "Spremam…" : "Sačuvaj"}
//         </button>
//       </Form>
//     </Panel>
//   );
// }

// src/admin/pages/MetaSettingsAdminPage.jsx
// src/admin/pages/MetaSettingsAdminPage.jsx
import React from "react";
import styled from "styled-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "../api/adminApi.js";

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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eef2f7;
  margin: 0;
`;

const Form = styled.form`
  display: grid;
  gap: 16px;
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 13px;
  color: #334155;
`;

const Input = styled.input`
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;

  &:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
  }
`;

const Textarea = styled.textarea`
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  min-height: 110px;
  resize: vertical;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;

  &:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
  }
`;

const TwoCol = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Actions = styled.div`
  position: sticky;
  bottom: 0;
  padding-top: 8px;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.82),
    rgba(255, 255, 255, 0)
  );
  display: flex;
  gap: 10px;

  button {
    border: 1px solid #e2e8f0;
    background: #0f172a;
    color: #fff;
    padding: 10px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.2px;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Hint = styled.small`
  color: #64748b;
  font-size: 12px;
`;

const ErrorText = styled.div`
  color: #b91c1c;
`;

/* ===== Toast ===== */
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
  background: ${({ type }) => (type === "error" ? "#991b1b" : "#139e1a")};
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
  const [toast, setToast] = React.useState(null); // { id, type, msg, open }

  const show = React.useCallback(
    (msg, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToast({ id, type, msg, open: true });
      const t = setTimeout(() => {
        setToast((cur) => (cur?.id === id ? { ...cur, open: false } : cur));
        setTimeout(() => {
          setToast((cur) => (cur?.id === id ? null : cur));
        }, 200);
      }, timeoutMs);
      return () => clearTimeout(t);
    },
    [timeoutMs]
  );

  const node = toast ? (
    <ToastWrap>
      <ToastItem
        role="status"
        aria-live="polite"
        open={toast.open}
        type={toast.type}
      >
        {toast.msg}
      </ToastItem>
    </ToastWrap>
  ) : null;

  return { show, node };
}

export default function MetaPage() {
  const qc = useQueryClient();
  const { show, node: toastNode } = useToast(2500);

  // 1) Uvijek na vrhu
  const metaQuery = useQuery({
    queryKey: ["admin-meta"],
    queryFn: AdminAPI.getMeta,
    staleTime: 30_000,
  });

  const saveMutation = useMutation({
    mutationFn: AdminAPI.updateMeta,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-meta"] });
      show("Promjene su sačuvane.");
    },
    onError: (err) => {
      show(err?.message || "Greška pri spremanju.", "error");
    },
  });

  // 2) Lokalni form state
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    license: "",
    contact_email: "",
    public_base_url: "",
  });

  // 3) Sync kad stignu podaci
  React.useEffect(() => {
    if (metaQuery.data) {
      const d = metaQuery.data;
      setForm({
        title: d.title ?? "",
        description: d.description ?? "",
        license: d.license ?? "",
        contact_email: d.contact_email ?? "",
        public_base_url: d.public_base_url ?? "",
      });
    }
  }, [metaQuery.data]);

  if (metaQuery.isLoading) return <Panel>Učitavanje metapodataka…</Panel>;
  if (metaQuery.isError) {
    return (
      <Panel>
        <ErrorText>
          Greška: {(metaQuery.error && metaQuery.error.message) || "Neuspjelo"}
        </ErrorText>
      </Panel>
    );
  }

  const lastUpdated = metaQuery.data?.updatedAt
    ? new Date(metaQuery.data.updatedAt).toLocaleString()
    : "—";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <>
      <Panel>
        <Head>
          <div>
            <h3>Metapodaci</h3>
            <small>Zadnje ažuriranje: {lastUpdated}</small>
          </div>
        </Head>

        <Divider />

        <Form onSubmit={onSubmit}>
          <Field>
            <Label>Naslov skupa</Label>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="npr. Open Data – Parking Tešanj"
            />
            <Hint>Kratak, jasan naslov koji opisuje dataset.</Hint>
          </Field>

          <Field>
            <Label>Opis</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Opis skupa podataka…"
            />
          </Field>

          <TwoCol>
            <Field>
              <Label>Licenca</Label>
              <Input
                type="text"
                name="license"
                value={form.license}
                onChange={onChange}
                placeholder="npr. CC BY 4.0"
              />
            </Field>

            <Field>
              <Label>Kontakt email</Label>
              <Input
                type="email"
                name="contact_email"
                value={form.contact_email}
                onChange={onChange}
                placeholder="kontakt@primjer.ba"
              />
            </Field>
          </TwoCol>

          <Field>
            <Label>Public base URL</Label>
            <Input
              type="text"
              name="public_base_url"
              value={form.public_base_url}
              onChange={onChange}
              placeholder="https://opendata.tesanj.ba"
            />
            <Hint>
              Osnovni URL koji će javni frontend koristiti u linkovima.
            </Hint>
          </Field>

          <Actions>
            <button type="submit" disabled={saveMutation.isLoading}>
              {saveMutation.isLoading ? "Spremam…" : "Sačuvaj promjene"}
            </button>
          </Actions>
        </Form>
      </Panel>

      {toastNode}
    </>
  );
}
