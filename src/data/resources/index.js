import { tools } from './tools';
import { skills } from './skills';
import { guides } from './guides';
import { winners } from './winners';

export { tools, skills, guides, winners };
export * from './taxonomy';

const intersects = (a = [], b = []) => a.some((x) => x === '*' || b.includes(x));

export function filterByThemes(items, themes) {
  if (!themes || themes.length === 0) return items;
  return items.filter((it) => intersects(it.themes, themes));
}

export function featuredFor(items, event, idKey) {
  const ids = event?.[idKey] || [];
  if (ids.length === 0) return [];
  return ids.map((id) => items.find((it) => it.id === id)).filter(Boolean);
}

export function byIds(items, ids = []) {
  return ids.map((id) => items.find((it) => it.id === id)).filter(Boolean);
}

export function bundleFor(event, opts = {}) {
  const {
    toolsLimit = 8,
    skillsLimit = 6,
    guidesLimit = 4,
    winnersLimit = 3,
  } = opts;
  const themes = event?.themes || [];
  const featuredT = featuredFor(tools, event, 'featuredToolIds');
  const baseT = filterByThemes(tools, themes).filter((t) => !featuredT.includes(t));
  const priorityOrder = { essential: 0, recommended: 1, advanced: 2 };
  return {
    tools: [...featuredT, ...baseT]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, toolsLimit),
    skills: skills
      .filter((s) => (s.themes || []).includes('*') || intersects(s.themes, themes))
      .sort((a, b) => (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99))
      .slice(0, skillsLimit),
    guides: filterByThemes(guides, themes).slice(0, guidesLimit),
    winners: filterByThemes(winners, themes).slice(0, winnersLimit),
  };
}
