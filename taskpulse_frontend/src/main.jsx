import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import DebugBoundary from "./DebugBoundary";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DebugBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DebugBoundary>
  </React.StrictMode>
);
