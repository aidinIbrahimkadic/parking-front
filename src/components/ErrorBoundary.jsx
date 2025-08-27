import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, err };
  }
  componentDidCatch(err, info) {
    /* opc: console.error(err, info); */
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 12,
            border: "1px solid #fca5a5",
            background: "#fef2f2",
          }}
        >
          <strong>Greška u sekciji:</strong>{" "}
          <code>{this.props.label || "Nepoznato"}</code>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
            {String(this.state.err?.message || this.state.err || "")}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
