import NodeCache, { Key } from "node-cache";

const withCache = <A extends Array<any>, R>(fn: (...args: A) => Promise<R>, getCacheKey: (...args: A) => Key) => {
  const cache = new NodeCache({
    stdTTL: 60 * 60,
    useClones: false,
  });

  return async (...args: A): Promise<R> => {
    const cacheKey = getCacheKey?.(...args) ?? args[0];
    const cached = cache.get<Promise<R>>(cacheKey);
    if (cached !== undefined) {
      return await cached;
    }

    const promise = fn(...args);
    cache.set(cacheKey, promise);
    return await promise;
  };
}

export default withCache;
