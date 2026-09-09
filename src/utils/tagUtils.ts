/** Normalize a free-text tag: trim, lowercase, strip leading `#`. */
export function normalizeTagName(raw: string): string {
  return raw.trim().toLowerCase().replace(/^#/, '');
}

/** Filter known tags by query, excluding already-selected tags. */
export function filterTagSuggestions(
  allTags: string[],
  query: string,
  selectedTags: string[]
): string[] {
  const clean = normalizeTagName(query);
  if (!clean) return [];
  return allTags.filter(
    tag => tag.toLowerCase().includes(clean) && !selectedTags.includes(tag)
  );
}
