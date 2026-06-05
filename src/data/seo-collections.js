// SEO landing page configs. One entry per route slug. Keep titles ≤60 chars,
// descriptions ≤155. Adding a new entry here surfaces it in /events 'browse by
// category' grid and lights up a route once registered in App.jsx.

import {
  Tag, Trophy, Code, Bot, Coins, Calendar as CalIcon,
} from 'lucide-react';

export function isFree(e) { return /\bfree\b/i.test(e.cost || ''); }
export function matchesAi(e) {
  const blob = `${e.name || ''} ${(e.tags || []).join(' ')} ${e.description || ''}`;
  return /\b(AI|GenAI|gen ai|LLM|GPT|machine learning|ML|deep learning|agentic|agent|RAG)\b/i.test(blob);
}
export function matchesWeb3(e) {
  if (e.category === 'web3') return true;
  const blob = `${e.name || ''} ${(e.tags || []).join(' ')}`;
  return /\b(web3|blockchain|crypto|nft|defi|ethereum|solana|polygon|chainlink|dao)\b/i.test(blob);
}

export const COLLECTIONS = {
  'free-tech-events-mumbai': {
    h1: ['Free Tech Events in', 'Mumbai — June 2026'],
    eyebrow: 'Curated · No ticket cost',
    icon: Tag,
    accent: 'emerald',
    intro:
      'Every free-to-attend tech event in Mumbai this June — developer meetups, AI community sessions, startup networking and the IBM Agentic AI Summit. No tickets, no paywalls.',
    title: 'Free Tech Events in Mumbai June 2026 — AI, Dev Meetups',
    description:
      'Free-to-attend tech events in Mumbai, June 2026: JS Mumbai, eChai startup meetups, Microsoft Build //localhost, IBM Agentic AI Summit and weekly AI co-working. Verified links.',
    keywords: ['free tech events mumbai', 'free dev meetups mumbai', 'free ai events mumbai', 'free startup events mumbai'],
    filter: isFree,
    faqs: [
      { q: 'Are there really free tech events in Mumbai in June 2026?', a: 'Yes — many events on this site are free, including JS Mumbai, the eChai Ventures startup meetups, Microsoft Build //localhost: Mumbai, the IBM Agentic AI Summit (virtual) and the weekly MumbAI AI Saturdays and Friday Tech Mixer.' },
      { q: 'How do I attend a free meetup in Mumbai?', a: 'Click any event on this page. Most use Lu.ma, Meetup or eChai for free RSVP — a few require host approval. Bring your laptop and a way to network.' },
      { q: 'Do I need to register in advance?', a: 'Yes for most. Free community events fill up, and some (like Microsoft Build //localhost) require host approval, so RSVP early via the linked source page.' },
    ],
  },

  'ai-events-mumbai-2026': {
    h1: ['AI Events in', 'Mumbai — June 2026'],
    eyebrow: 'AI · GenAI · LLMs · Agents',
    icon: Bot,
    accent: 'violet',
    intro:
      'Mumbai\'s June AI calendar — the MCP Dev Summit and Open AI & Data track at Open Source Summit, the IBM Agentic AI Summit, the Data & Gen AI Summit, Microsoft Build //localhost and weekly AI builder co-working.',
    title: 'AI Events in Mumbai June 2026 — Summits, Meetups, Workshops',
    description:
      'AI events in Mumbai, June 2026: MCP Dev Summit, IBM Agentic AI Summit, Data & Gen AI Summit, Microsoft Build //localhost and weekly MumbAI AI Saturdays. Dates and links.',
    keywords: ['ai events mumbai', 'genai summit mumbai', 'agentic ai mumbai', 'mcp dev summit mumbai', 'ai meetups mumbai'],
    filter: matchesAi,
    faqs: [
      { q: 'What AI events are happening in Mumbai in June 2026?', a: 'The MCP Dev Summit (Jun 14–15), Open Source Summit India\'s Open AI & Data track (Jun 16–17), the IBM Agentic AI Summit (Jun 17–18, virtual), the Data & Gen AI Summit (Jun 11), Microsoft Build //localhost (Jun 13 & 20) and the weekly MumbAI AI Saturdays co-working.' },
      { q: 'Are AI events in Mumbai free?', a: 'Several are — Microsoft Build //localhost, the IBM Agentic AI Summit and the weekly AI co-working meetups are free. Conference-grade summits (MCP Dev Summit, Data & Gen AI Summit) are paid.' },
      { q: 'How do I find AI sessions in June?', a: 'Filter by the AI tag on the June events page, or open any event on this page for its registration link.' },
    ],
  },

  'conferences-mumbai-2026': {
    h1: ['Tech Conferences in', 'Mumbai — June 2026'],
    eyebrow: 'Open Source · Cloud Native · Enterprise',
    icon: Code,
    accent: 'primary',
    intro:
      'June is Mumbai\'s open-source month. The Linux Foundation brings Open Source Week to Jio World Convention Centre — KubeCon + CloudNativeCon India, Open Source Summit India, OpenSearchCon India and the MCP Dev Summit — alongside the Data & Gen AI Summit and JS Mumbai.',
    title: 'Tech Conferences in Mumbai June 2026 — KubeCon, Open Source Summit',
    description:
      'Major tech conferences in Mumbai, June 2026: KubeCon + CloudNativeCon India, Open Source Summit India, OpenSearchCon India, MCP Dev Summit and Data & Gen AI Summit. Dates, venues, links.',
    keywords: ['conferences in mumbai 2026', 'kubecon india 2026', 'open source summit india', 'opensearchcon india', 'developer conferences india'],
    filter: (e) => e.category === 'conference',
    faqs: [
      { q: 'What is the biggest tech conference in Mumbai in June 2026?', a: 'KubeCon + CloudNativeCon India (Jun 18–19, Jio World Convention Centre, BKC) is the headline, part of the Linux Foundation\'s Open Source Week Mumbai (Jun 14–19) alongside Open Source Summit India and OpenSearchCon India.' },
      { q: 'When and where is Open Source Week Mumbai 2026?', a: 'June 14–19, 2026 at the Jio World Convention Centre, BKC: MCP Dev Summit (14–15), OpenSearchCon India (15–16), Open Source Summit India (16–17) and KubeCon + CloudNativeCon India (18–19).' },
      { q: 'Are these conferences paid?', a: 'Yes — the Linux Foundation conferences are ticketed (academic and individual discounts available). JS Mumbai is free; the Data & Gen AI Summit and MCP Dev Summit are paid.' },
    ],
  },

  'web3-events-mumbai-2026': {
    h1: ['Web3 & Crypto Events in', 'Mumbai — 2026'],
    eyebrow: 'Blockchain · DeFi · NFT · DAO',
    icon: Coins,
    accent: 'amber',
    intro:
      'Web3, blockchain and crypto events across Mumbai. We only list events with verified dates and public registration — no Web3 conference is confirmed for June 2026 yet, so check back as new dates are announced.',
    title: 'Web3 & Crypto Events in Mumbai 2026 — Blockchain, DeFi, NFT',
    description:
      'Web3 and crypto events in Mumbai 2026 — link-verified blockchain, DeFi and NFT meetups and conferences. Updated as new dates are confirmed.',
    keywords: ['web3 events mumbai', 'crypto events mumbai', 'blockchain meetups mumbai', 'defi events india'],
    filter: matchesWeb3,
    faqs: [
      { q: 'Are there Web3 events in Mumbai?', a: 'Mumbai has an active Web3 community, but we only list events with verified dates and public registration. No major Web3 conference is confirmed for June 2026 yet — this page updates as new dates are announced.' },
      { q: 'How do you verify Web3 events?', a: 'Every listing is cross-checked against its primary source (the organiser\'s page or Lu.ma/Devfolio). We do not publish unconfirmed or speculative dates.' },
    ],
  },
};
