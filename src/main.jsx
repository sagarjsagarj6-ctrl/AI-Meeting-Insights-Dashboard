import React from "react";
import { createRoot } from "react-dom/client";
import EchoBoard from "../EchoBoard.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EchoBoard />
  </React.StrictMode>
);
