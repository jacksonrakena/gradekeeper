import { Provider } from "jotai";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/globals.css";
import { AppRoot } from "./app";
import * as Sentry from "@sentry/react";

console.log("Gradekeeper Javascript client (c) Jackson Rakena, initialising", new Date());

Sentry.init({
  dsn: "https://fdf22ae11de94bc789bead6c3d9c9f94@o197040.ingest.us.sentry.io/4505561652658176",
  sendDefaultPii: true,
  release: import.meta.env.CF_PAGES_COMMIT_SHA,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <AppRoot />
    </Provider>
  </StrictMode>
);
