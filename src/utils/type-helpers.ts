export const notNull = <T>(value: T | null): value is T => {
  return value !== null;
}

export const notUndefined = <T>(value: T | undefined): value is T => {
  return value !== undefined;
}

export const notNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
}

export const entryNotNullish = <K, V>(entry: [K, V | null | undefined]): entry is [K, V] => {
  return notNullish(entry[1]);
}

export const entries = <K extends string, V>(object: Record<K, V>): [K, V][] => {
  return Object.entries(object) as [K, V][];
}
