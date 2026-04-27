import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Handle "ChunkLoadError" which causes white screens after new deployments
window.addEventListener('error', (e) => {
  if (e.message.includes('Importing a module script failed') || e.message.includes('chunk')) {
    console.warn('Assets failed to load, likely due to a new version. Refreshing...');
    window.location.reload();
  }
}, true);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
      
      // If there's an update, reload the page to get the new version
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content is available; please refresh.');
              window.location.reload();
            }
          };
        }
      };
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);