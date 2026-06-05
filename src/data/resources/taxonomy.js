// Single source of truth for all resource tags.
// Every entry in tools.js / ideas.js / skills.js / guides.js / winners.js
// must reference keys that exist here. `verify-resources.mjs` enforces this.

export const THEMES = {
  'ai-agents':          { label: 'AI Agents',          color: 'bg-violet-50 text-violet-700' },
  'llm':                { label: 'LLM',                color: 'bg-indigo-50 text-indigo-700' },
  'rag':                { label: 'RAG',                color: 'bg-sky-50 text-sky-700' },
  'coding-assistants':  { label: 'Coding Assistants',  color: 'bg-blue-50 text-blue-700' },
  'ml-pytorch':         { label: 'ML / PyTorch',       color: 'bg-amber-50 text-amber-700' },
  'web3':               { label: 'Web3',               color: 'bg-orange-50 text-orange-700' },
  'data-context':       { label: 'Data / Context',     color: 'bg-emerald-50 text-emerald-700' },
  'devtools-general':   { label: 'Dev Tools',          color: 'bg-slate-100 text-slate-700' },
  'vibecoding':         { label: 'Vibe Coding',        color: 'bg-rose-50 text-rose-600' },
  'multimodal':         { label: 'Multimodal',         color: 'bg-fuchsia-50 text-fuchsia-700' },
};

export const TOOL_CATEGORIES = {
  sdk:         { label: 'SDK' },
  boilerplate: { label: 'Boilerplate' },
  infra:       { label: 'Infra / Deploy' },
  db:          { label: 'Database' },
  ui:          { label: 'UI' },
  auth:        { label: 'Auth' },
  eval:        { label: 'Eval / Observability' },
  data:        { label: 'Data / APIs' },
};

export const FREE_TIERS = {
  free:              { label: 'Free',           tone: 'emerald' },
  oss:               { label: 'Open Source',    tone: 'blue' },
  credits:           { label: 'Free Credits',   tone: 'violet' },
  student:           { label: 'Student Pack',   tone: 'amber' },
  'paid-with-trial': { label: 'Free Trial',     tone: 'slate' },
};

export const SKILL_CATEGORIES = {
  speed:        { label: 'Ship Fast' },
  security:     { label: 'Security' },
  'demo-craft': { label: 'Demo Craft' },
  'team-ops':   { label: 'Team Ops' },
};

export const PRIORITIES = {
  essential:   { label: 'Essential',   tone: 'rose' },
  recommended: { label: 'Recommended', tone: 'violet' },
  advanced:    { label: 'Advanced',    tone: 'slate' },
};
