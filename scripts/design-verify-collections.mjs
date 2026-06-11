export function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

export function uniqueSorted(values) {
  return sorted(new Set(values));
}
