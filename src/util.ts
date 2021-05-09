export function toMap<T, TKey, TValue>(ts: T[], keyFn: (t: T) => TKey) {
  const map = new Map<TKey, T>();
  for (const t of ts) {
    map.set(keyFn(t), t);
  }
  return map;
}

export function counter<T>(ts: T[]): Map<T, number> {
  return ts.reduce((counts, t) => {
    counts.set(t, (counts.get(t) ?? 0) + 1);
    return counts;
  }, new Map<T, number>());
}
