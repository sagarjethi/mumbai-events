export function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function findEventBySlug(events, slug) {
  return events.find((e) => toSlug(e.name) === slug);
}
