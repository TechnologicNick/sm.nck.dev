export const notNull = <T>(value: T | null): value is T => {
  return value !== null;
}

export const notUndefined = <T>(value: T | undefined): value is T => {
  return value !== undefined;
}

export const notNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
}
