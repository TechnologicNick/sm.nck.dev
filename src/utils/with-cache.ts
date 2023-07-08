import { createStaleWhileRevalidateCache } from "stale-while-revalidate-cache";

const withCache = <A extends Array<any>, R>(fn: (...args: A) => Promise<R>, getCacheKey: (...args: A) => string | number) => {
  const store = Object.create(null);

  const swr = createStaleWhileRevalidateCache({
    storage: {
      async getItem(cacheKey: string) {
        return store[cacheKey];
      },
      async setItem(cacheKey: string, cacheValue: any) {
        store[cacheKey] = cacheValue;
      },
      async removeItem(cacheKey: string) {
        delete store[cacheKey];
      },
    },
    minTimeToStale: 60 * 60 * 1000, // 1 hour
    maxTimeToLive: Infinity,
  });

  return async (...args: A): Promise<R> => {
    const cacheKey = getCacheKey?.(...args) ?? args[0];

    const res = await swr(`${cacheKey}`, () => fn(...args));
    return res.value;
  };
}

export default withCache;
