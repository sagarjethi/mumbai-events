import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {
  EVENT_COUNT,
  FREE_COUNT,
  HACKATHON_COUNT,
  TOTAL_PRIZE_LABEL,
  PRIZE_TOTALS,
} from './src/utils/stats.js'

// Inject computed counts/prize totals into index.html so the static HTML that
// crawlers and noscript clients see stays in sync with `data/events.js`.
// All consumers (Header, Stats, HackathonsPage, etc.) already import from
// `src/utils/stats.js`; this plugin is the bridge for the static HTML.
function statsHtmlPlugin() {
  const tokens = {
    __EVENT_COUNT__: String(EVENT_COUNT),
    __EVENT_COUNT_LABEL__: `${EVENT_COUNT}+`,
    __FREE_COUNT__: String(FREE_COUNT),
    __HACKATHON_COUNT__: String(HACKATHON_COUNT),
    __TOTAL_PRIZE_LABEL__: TOTAL_PRIZE_LABEL,
    __PRIZE_POOLS_COUNT__: String(PRIZE_TOTALS.count),
  }
  return {
    name: 'inject-stats-into-html',
    transformIndexHtml(html) {
      return Object.entries(tokens).reduce(
        (acc, [token, value]) => acc.split(token).join(value),
        html
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), statsHtmlPlugin()],
})
