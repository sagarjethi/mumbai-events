// AI hackathon winners — real, URL-verified projects for builder inspiration.
// Sources include the Gemini API Developer Competition 2024 and Devpost
// hackathons (GenAI Genesis 2025). Every URL HEAD-checked by the verify script.

export const winners = [
  // ── Gemini API Developer Competition 2024 (ai.google.dev) ───────────────
  {
    id: 'jayu-gemini-best-overall',
    name: 'Jayu',
    hackathon: 'Gemini API Developer Competition 2024 — Best Overall',
    url: 'https://ai.google.dev/competition/projects/jayu',
    themes: ['ai-agents', 'llm', 'multimodal'],
    stack: ['google-gemini-api'],
    builderNote: 'Personal assistant deeply integrated with Gemini on-device. Won Best Overall — proves a focused agent beats a sprawling app.',
    verifiedOn: '2026-04-15',
  },
  {
    id: 'vite-vere-gemini-most-impactful',
    name: 'VITE VERE',
    hackathon: 'Gemini API Developer Competition 2024 — Most Impactful',
    url: 'https://ai.google.dev/competition/projects/vite-vere',
    themes: ['ai-agents', 'llm', 'multimodal'],
    stack: ['google-gemini-api'],
    builderNote: 'Flutter app using Gemini + TTS to give personalized support to people with intellectual disabilities across home, mobility, and work.',
    verifiedOn: '2026-04-15',
  },
  {
    id: 'prospera-gemini-most-useful',
    name: 'Prospera',
    hackathon: 'Gemini API Developer Competition 2024 — Most Useful',
    url: 'https://ai.google.dev/competition/projects/prospera',
    themes: ['ai-agents', 'llm'],
    stack: ['google-gemini-api'],
    builderNote: 'Real-time sales coach that listens during live calls and surfaces contextual advice. Concrete high-value workflow shipped end-to-end.',
    verifiedOn: '2026-04-15',
  },
  {
    id: 'gaze-link-gemini-best-android',
    name: 'Gaze Link',
    hackathon: 'Gemini API Developer Competition 2024 — Best Android',
    url: 'https://ai.google.dev/competition/projects/gaze-link',
    themes: ['multimodal', 'ai-agents', 'llm'],
    stack: ['google-gemini-api'],
    builderNote: 'ALS communication aid: ML Kit eye-tracking + Gemini 1.5 Flash expands eye-typed keywords into sentences. Measured 85% keystroke reduction.',
    verifiedOn: '2026-04-15',
  },
  {
    id: 'viddyscribe-gemini-best-web',
    name: 'ViddyScribe',
    hackathon: 'Gemini API Developer Competition 2024 — Best Web App',
    url: 'https://ai.google.dev/competition/projects/viddyscribe',
    themes: ['multimodal', 'llm'],
    stack: ['google-gemini-api'],
    builderNote: 'Auto-generates timestamped audio descriptions for videos so blind users can follow along. Gemini analyzes frames; TTS synthesizes narration.',
    verifiedOn: '2026-04-15',
  },

  // ── Devpost — GenAI Genesis 2025 (devpost.com) ───────────────────────────
  {
    id: 'thoughtmirror-genai-genesis',
    name: 'ThoughtMirror',
    hackathon: 'Devpost GenAI Genesis 2025 — Best Generative AI Technology Hack',
    url: 'https://devpost.com/software/thoughtmirror',
    themes: ['ai-agents', 'llm', 'rag'],
    stack: ['google-gemini-api', 'vercel'],
    builderNote: 'AI journaling app that spots cognitive distortions and reframes them. Fine-tuned Gemini + RAG pipeline. Next.js + FastAPI + Firebase.',
    verifiedOn: '2026-04-15',
  },
  {
    id: 'imagehr-genai-genesis',
    name: 'imagEHR',
    hackathon: 'Devpost GenAI Genesis 2025 — Best Healthcare AI Hack',
    url: 'https://devpost.com/software/imagehr',
    themes: ['multimodal', 'data-context', 'ai-agents'],
    stack: [],
    builderNote: 'Extracts clinical data from EHRs and X-rays into CDISC-SDTM regulatory format. Cohere LMs + YOLOv5. Replaces a 6–8 week manual process.',
    verifiedOn: '2026-04-15',
  },
  {
    id: 'earthlens-genai-genesis',
    name: 'EarthLens',
    hackathon: 'Devpost GenAI Genesis 2025 — Best Climate & Sustainability AI Hack',
    url: 'https://devpost.com/software/disasterboard',
    themes: ['multimodal', 'ai-agents', 'data-context'],
    stack: ['google-gemini-api'],
    builderNote: 'Disaster response platform: satellite + weather + social media → Gemini + NotebookLM forecasts. Trained on 50+ years of disaster data.',
    verifiedOn: '2026-04-15',
  },
];
