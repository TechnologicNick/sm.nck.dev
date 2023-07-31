import withCache from "utils/with-cache";
import { describe, expect, test, vi } from "vitest";

const deferred = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    resolve,
    reject,
    promise,
  };
};

describe("withCache", () => {
  test("runs the function if the cache is empty", async () => {
    const add = withCache(async (a: number, b: number) => {
      return a + b;
    }, (a: number, b: number) => `${a}+${b}`);

    const actual = await add(1, 2);
    expect(actual).toBe(3);
  });

  test("returns the cached value if the cache is not empty", async () => {
    const addFn = vi.fn(async (a: number, b: number) => a + b);

    const add = withCache(addFn, (a: number, b: number) => `${a}+${b}`);

    {
      const actual = await add(1, 2);
      expect(actual).toBe(3);
    }
    {
      const actual = await add(1, 2);
      expect(actual).toBe(3);
    }

    expect(addFn).toHaveBeenCalledOnce();
  });

  test("pending promises are cached", async () => {
    const def = deferred<string>();

    const timeout = setTimeout(() => def.resolve("timeout"), 50);
    
    const fn = vi.fn(async () => {
      return await def.promise;
    });
    const cache = withCache(fn, () => 0);

    const a = cache();
    const b = cache();

    def.resolve("result");
    await Promise.all([a, b]);

    expect(fn).toHaveBeenCalledOnce();

    clearTimeout(timeout);
  }, {
    timeout: 100,
  });

  test("promiseStore is cleared after the promise resolves", async () => {
    const cache = withCache(async () => "result", () => 0);
    await cache();
    expect(cache.promiseStore).toEqual({});
  });

  test("promiseStore is cleared after the promise rejects", async () => {
    const cache = withCache(async () => {
      throw new Error("error");
    }, () => 0);

    await expect(() => cache()).rejects.toThrowError("error");
    expect(cache.promiseStore).toEqual({});
  });
});
