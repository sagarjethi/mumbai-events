# Mumbai Tech Events — April 15–26, 2026

Your complete guide to **38+ events** happening in Mumbai, India's tech capital.

**Live Site:** [https://mumbai-events.sagarjethi.com](https://mumbai-events.sagarjethi.com)

## About

A curated directory of tech conferences, hackathons, meetups, and cultural events taking place in Mumbai from April 15–26, 2026. Features include:

- Interactive calendar view with date-based filtering
- Individual event detail pages with lu.ma-style UI
- Interactive map with all event venues pinpointed across Mumbai
- Google Maps directions for every event
- Social buzz page with X, LinkedIn, Instagram, and attendee connections
- Luma event RSVPs with attendee counts
- Coupons & free event deals section
- LLM/AI agent discovery files (llms.txt, llms-full.txt)
- SEO-optimized: JSON-LD, Open Graph, Twitter Cards, per-page meta tags
- Fully responsive design for mobile and desktop

## Featured Events

| Category | Highlights |
|----------|-----------|
| **Conferences** | AWS Summit, GIDS 2026, Tech & Innovation Summit, Rust India Conference |
| **Hackathons** | OpenAI Codex Hackathon ($100K), Meta PyTorch ($30K), ElevenLabs Buildathon, Aya AI ($20K+) |
| **Startup** | YC Startup School India, VibeCon India, YC Secret (AI)fter Party |
| **Community** | GDG Build For Mumbai, Golang Meetup, AI Tinkerers |
| **Running** | TCS World 10K Mumbai |

## Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool with HMR
- **Tailwind CSS 4** — Utility-first styling
- **React Router DOM** — Client-side routing
- **Leaflet + React Leaflet** — Interactive maps (OpenStreetMap)
- **Lucide React** — Icon library
- **React Helmet Async** — SEO meta tag management
- **Vercel** — Deployment

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with calendar, events grid, social buzz, platforms |
| `/events/:slug` | Individual event detail page with map, directions, related events |
| `/social` | Social buzz page — X, LinkedIn, Instagram, attendees, Luma events |
| `/map` | Interactive map with all event venues, category filters, directions |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── App.jsx                # Root component with routes
├── main.jsx               # Entry point with Router + Helmet
├── index.css              # Tailwind + design tokens
├── utils/
│   └── slug.js            # URL slug utilities
├── components/
│   ├── Header.jsx         # Hero section
│   ├── Navigation.jsx     # Nav bar with page links
│   ├── Stats.jsx          # Event statistics
│   ├── CalendarView.jsx   # Interactive calendar
│   ├── EventsGrid.jsx     # Event cards grid with search/filter
│   ├── EventCard.jsx      # Individual event card
│   ├── EventDetail.jsx    # Event detail page (lu.ma-style)
│   ├── EventMap.jsx       # Leaflet map component (reusable)
│   ├── MapPage.jsx        # Dedicated map page
│   ├── SocialBuzz.jsx     # Social media highlights (homepage)
│   ├── SocialPage.jsx     # Full social buzz page
│   ├── TweetSupportModal.jsx # Tweet support popup
│   ├── Platforms.jsx      # Event platform links
│   ├── Footer.jsx         # Footer
│   └── SEO.jsx            # JSON-LD structured data
├── data/
│   ├── events.js          # All events with coordinates
│   └── social.js          # Social posts, attendees, Luma events
public/
├── llms.txt               # LLM summary (AI agent discovery)
├── llms-full.txt          # Full event data for AI agents
├── favicon.svg
├── og-image.svg
├── robots.txt
├── sitemap.xml
└── icons.svg
```

## Credits

- Event data compiled from Eventbrite, Meetup, Luma, AllEvents, Hasgeek, Dev.Events, and official event websites
- Built by [Sagar Jethi](https://www.linkedin.com/in/sagarjethi) · [@sagarbjethi](https://x.com/sagarbjethi)

## License

MIT
