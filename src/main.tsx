import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import { CartProvider } from "./context/CartContext";

const rootEl = document.getElementById('root')!

// react-snap pre-renders pages as static HTML, then the SPA hydrates them.
// Use hydrateRoot when content already exists (pre-rendered), createRoot otherwise.
const app = (
  <StrictMode>
    <HelmetProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </HelmetProvider>
  </StrictMode>
)

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}
