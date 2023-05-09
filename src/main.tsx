import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import {
  SessionContext,
  SessionContextProvider,
} from "./contexts/SessionContext";
import "./root.css";
import {
  AUTHENTICATED_ROUTES,
  PUBLIC_ROUTES,
  UNAUTHENTICATED_ROUTES,
} from "./routes";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <SessionContextProvider>
        <Router />
      </SessionContextProvider>
    </StrictMode>
  );
}

function Router() {
  const { agent } = useContext(SessionContext);

  const ROUTES = [...PUBLIC_ROUTES];
  if (agent !== null) {
    ROUTES.push(...AUTHENTICATED_ROUTES);
  } else {
    ROUTES.push(...UNAUTHENTICATED_ROUTES);
  }

  return (
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
