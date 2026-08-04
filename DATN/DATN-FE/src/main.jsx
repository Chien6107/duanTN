import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "./styles/index.css";

// Polyfill Node.prototype.removeChild and insertBefore to prevent DOM errors caused by Google Translate or external extensions
if (typeof window !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode);
      }
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught Root Error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "#09090b",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "center"
        }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem"
          }}>
            !
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "900", marginBottom: "0.5rem" }}>
            Ứng dụng gặp sự cố tải dữ liệu
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#a1a1aa", maxWidth: "480px", marginBottom: "1.5rem", lineHeight: "1.6" }}>
            {this.state.error?.message || "Đã xảy ra lỗi không mong muốn khi khởi tạo ứng dụng."}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#ea580c",
                color: "#ffffff",
                fontWeight: "700",
                fontSize: "0.875rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer"
              }}
            >
              Tải lại trang
            </button>
            <button
              onClick={this.handleReset}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#27272a",
                color: "#e4e4e7",
                fontWeight: "700",
                fontSize: "0.875rem",
                borderRadius: "0.75rem",
                border: "1px solid #3f3f46",
                cursor: "pointer"
              }}
            >
              Xóa bộ nhớ đệm & Tải lại
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <GlobalErrorBoundary>
    <App />
  </GlobalErrorBoundary>
);


