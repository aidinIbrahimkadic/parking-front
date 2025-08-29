// src/components/CopyButton.jsx
import React from "react";

export default function CopyButton({ text, children = "Kopiraj" }) {
  const handle = async () => {
    try {
      const val = text ?? window.location.href;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(val);
      } else {
        const ta = document.createElement("textarea");
        ta.value = val;
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      console.log("[copy] ok");
    } catch (e) {
      console.error("[copy] fail", e);
    }
  };
  return (
    <button
      type="button"
      onClick={handle}
      style={{
        cursor: "pointer",
        backgroundColor: "#2e5d63",
        border: "none",
        outline: "none",
        color: "#fff",
        padding: ".3rem .6rem",
        borderRadius: "10px",
      }}
    >
      {children}
    </button>
  );
}
