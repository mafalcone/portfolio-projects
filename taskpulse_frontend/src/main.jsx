import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/globals.css";

const RootTest = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#020617",
      color: "white",
      fontSize: "24px",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    }}
  >
    TaskPulse frontend TEST ✅
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootTest />
  </React.StrictMode>
);
