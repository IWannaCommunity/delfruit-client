export function dedupeArray<T, K>(arr: T[], keyFn: (item: T) => K): T[] {
  return Array.from(new Map(arr.map((item) => [keyFn(item), item])).values());
}