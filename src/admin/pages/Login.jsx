// src/admin/pages/Login.jsx
import React from "react";
import styled from "styled-components";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const BG = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
  background: #f9fafb;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
`;

const Brand = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  font-family: Helvetica, sans-serif;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: #192f5e;
    letter-spacing: 0.2px;
  }
  span {
    color: #6b7280;
  }
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
  margin-bottom: 14px;

  font-family: Helvetica, sans-serif;

  span {
    font-size: 1rem;
    color: #374151;
  }
`;

const InputWrap = styled.div`
  position: relative;

  .icon-left {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #6b7280;
    pointer-events: none;
  }

  .icon-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    border: 0;
    background: transparent;
    padding: 4px;
    border-radius: 8px;
    cursor: pointer;
    color: #6b7280;
  }
  .icon-btn:hover {
    background: #f3f4f6;
  }

  /* HARD RESET — bijela pozadina bez obzira na globalne stilove/autofill */
  input {
    height: 44px;
    width: 80%;
    padding: 0 40px 0 36px;
    background: #ffffff !important;
    color: #111827;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    font-size: 14px;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    transition: border-color 120ms ease, box-shadow 120ms ease;
  }
  input::placeholder {
    color: #9ca3af;
  }
  input:focus {
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
    background: #ffffff !important;
  }
  /* Chrome autofill → zadrži bijelu pozadinu */
  input:-webkit-autofill,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:hover {
    -webkit-text-fill-color: #111827;
    box-shadow: 0 0 0px 1000px #ffffff inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const ErrorBar = styled.div`
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 13px;
  margin: 6px 0 12px;
`;

const Submit = styled.button`
  height: 44px;
  width: 100%;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;

  font-family: Helvetica, sans-serif;
  font-size: 1.2rem;
  letter-spacing: 1px;
  background: #111827;
  color: #ffffff;
  &:hover {
    background: #21335e;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Foot = styled.div`
  margin-top: 12px;
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
`;

export default function Login() {
  const navigate = useNavigate();
  const { isAuthed, signIn } = useAuth();

  // ako je već ulogovan → redirect na admin
  if (isAuthed) return <Navigate to="/admin" replace />;

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (ex) {
      setErr(
        ex?.message ||
          "Prijava nije uspjela. Provjerite podatke i pokušajte ponovo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <BG>
      <Card>
        <Brand>
          <h1>Parking Admin</h1>
          <span>Administracija sadržaja i open data</span>
        </Brand>

        {/* <Title>Prijava</Title>
        <Subtitle>Unesite svoje podatke za pristup panelu.</Subtitle> */}

        {err ? <ErrorBar>{err}</ErrorBar> : null}

        <form onSubmit={onSubmit}>
          <Field>
            <span>Email</span>
            <InputWrap>
              <svg className="icon-left" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3 7l9 6 9-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <input
                type="email"
                placeholder="admin@opcina-tesanj.ba"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </InputWrap>
          </Field>

          <Field>
            <span>Lozinka</span>
            <InputWrap>
              <svg className="icon-left" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="10"
                  width="18"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 10V8a4 4 0 0 1 8 0v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>

              <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="icon-btn"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Sakrij lozinku" : "Prikaži lozinku"}
                title={show ? "Sakrij lozinku" : "Prikaži lozinku"}
              >
                {show ? (
                  // eye-off
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3l18 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6 0 9.5 5.5 9.5 7-0.3 0.6-1.2 2.1-2.9 3.6m-3.2 2A11.4 11.4 0 0 1 12 19.1C6 19.1 2.5 13.6 2.5 12c0-.3.3-1 .9-1.9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                ) : (
                  // eye
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2.5 12S6 5.9 12 5.9 21.5 12 21.5 12 18 18.1 12 18.1 2.5 12 2.5 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </button>
            </InputWrap>
          </Field>

          <Submit type="submit" disabled={loading}>
            {loading ? "Prijavljivanje…" : "Prijava"}
          </Submit>
        </form>

        <Foot>© Općina Tešanj</Foot>
      </Card>
    </BG>
  );
}
