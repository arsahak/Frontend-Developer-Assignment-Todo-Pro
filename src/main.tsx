import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Theme initialization is now handled by the Redux slice

// Start MSW in development
if (import.meta.env.DEV) {
  const { worker } = await import("./mocks/browser");
  worker
    .start({
      onUnhandledRequest: "bypass",
    })
    .then(() => {
      console.log("MSW worker started successfully");
    })
    .catch((error) => {
      console.error("Failed to start MSW worker:", error);
    });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
