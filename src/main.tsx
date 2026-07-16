import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ColorPicker } from "./components/ColorPicker";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ColorPicker />
  </StrictMode>
);
