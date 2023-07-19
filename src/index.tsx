import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import "../styles/globals.css";
import { AppRoot } from "./app";

console.log("Gradekeeper Javascript client (c) Jackson Rakena, initialising", new Date());

createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <AppRoot />
  </RecoilRoot>
);
