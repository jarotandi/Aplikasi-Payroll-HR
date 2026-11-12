import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import StandaloneCanonicalPanel from "./canonical/StandaloneCanonicalPanel.jsx";
import "./styles.css";

// R20: isolated canonical mode never mounts the old localStorage demo app.
// Outside the explicit local integration flag, original standalone UX is intact.
const isolated=import.meta.env.VITE_QP1_ISOLATED_PAYROLL_READ === 'true';
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isolated ?
      <main className="min-h-screen bg-slate-50 p-4 lg:p-8">
        <StandaloneCanonicalPanel />
      </main> : <App />}
  </React.StrictMode>
);
