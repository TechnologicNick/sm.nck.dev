import { createStaleWhileRevalidateCache } from "stale-while-revalidate-cache";

const withCache = <A extends Array<any>, R>(fn: (...args: A) => Promise<R>, getCacheKey: (...args: A) => string | number) => {
  const store: { [cacheKey: string]: R } = Object.create(null);

  const swr = createStaleWhileRevalidateCache({
    storage: {
      getItem(cacheKey: string) {
        return store[cacheKey];
      },
      setItem(cacheKey: string, cacheValue: any) {
        store[cacheKey] = cacheValue;
      },
      removeItem(cacheKey: string) {
        delete store[cacheKey];
      },
    },
    minTimeToStale: 60 * 60 * 1000, // 1 hour
    maxTimeToLive: Infinity,
  });

  const cache = async (...args: A): Promise<R> => {
    const cacheKey = getCacheKey?.(...args) ?? args[0];

    const res = await swr(`${cacheKey}`, () => fn(...args));
    return res.value;
  };

  cache.swr = swr;
  cache.store = store;

  return cache;
}

export default withCache;
