import { createStaleWhileRevalidateCache } from "stale-while-revalidate-cache";
import { ResponseEnvelope } from "stale-while-revalidate-cache/types";

const withCache = <A extends Array<any>, R>(fn: (...args: A) => Promise<R>, getCacheKey: (...args: A) => string | number) => {
  const store: { [cacheKey: string]: R } = Object.create(null);
  const promiseStore: { [cacheKey: string]: Promise<ResponseEnvelope<Awaited<R>>> } = Object.create(null);

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

    if (cacheKey in promiseStore) {
      const res = await promiseStore[cacheKey];
      return res.value;
    }

    const promise = swr(`${cacheKey}`, () => fn(...args));
    promiseStore[cacheKey] = promise;

    try {
      const res = await promise;
      return res.value;
    } catch (err) {
      throw err;
    } finally {
      delete promiseStore[cacheKey];
    }
  };

  cache.swr = swr;
  cache.store = store;
  cache.promiseStore = promiseStore;

  return cache;
}

export default withCache;
