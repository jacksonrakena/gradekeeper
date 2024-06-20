import { Provider } from "jotai";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../styles/globals.css";
import { AppRoot } from "./app";

console.log("Gradekeeper Javascript client (c) Jackson Rakena, initialising", new Date());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <AppRoot />
    </Provider>
  </StrictMode>
);
