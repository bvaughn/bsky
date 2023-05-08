import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ROUTES } from "./config";
import "./root.css";
import ScrollToTop from "./components/ScrollToTop";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              Component={route.Component}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}
