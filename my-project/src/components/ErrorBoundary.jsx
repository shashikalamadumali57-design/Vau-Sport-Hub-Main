import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          background: "#f9fafb",
          padding: "2rem",
          textAlign: "center"
        }}>
          <h1 style={{ color: "#ef4444", fontSize: "2rem", marginBottom: "1rem" }}>
            ⚠️ Something went wrong
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
            The app crashed. Open the browser DevTools Console (F12) to see the full error.
          </p>
          <pre style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "1rem",
            borderRadius: "8px",
            maxWidth: "800px",
            overflowX: "auto",
            fontSize: "0.85rem",
            textAlign: "left"
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1.5rem",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.75rem 2rem",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
