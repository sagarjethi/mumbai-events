import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import './posthog.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
    {/* Vercel Web Analytics. Vite app, so the /react entry (not /next).
        Loads /_vercel/insights/script.js from this origin, which the CSP
        already allows; no-ops on localhost. */}
    <Analytics />
  </StrictMode>,
)
