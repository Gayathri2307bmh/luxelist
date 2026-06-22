import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Silence benign Vite HMR WebSocket connection errors and unhandled rejections
if (typeof window !== "undefined") {
  // Override console.error to silence specific Vite/WebSocket errors
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const msg = typeof args[0] === 'string' ? args[0] : '';
    if (
      msg.includes("websocket") ||
      msg.includes("WebSocket") ||
      msg.includes("vite")
    ) {
      return; // Silently ignore
    }
    originalConsoleError.apply(console, args);
  };

  window.addEventListener("error", (event) => {
    const msg = event.message || "";
    if (
      msg.includes("websocket") ||
      msg.includes("WebSocket") ||
      msg.includes("vite")
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, { capture: true });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    if (reason) {
      const reasonStr = typeof reason === "string" ? reason : (reason.message || String(reason));
      if (
        reasonStr.includes("websocket") ||
        reasonStr.includes("WebSocket") ||
        reasonStr.includes("vite")
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    }
  }, { capture: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
