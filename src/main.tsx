import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { reportWebVitals } from "./lib/vitals";

if (import.meta.env.DEV) {
  Promise.all([
    import('@axe-core/react')
  ]).then(([axe]) => {
    axe.default(React, ReactDOM, 1000);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
reportWebVitals();
