import asGlobalService from "utils/as-global-service";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";

describe("asGlobalService", () => {
  beforeEach(() => {
    global.services.clear();
  });

  test("runs the function if the service does not exist yet", async () => {
    const fn = vi.fn(() => "result");
    const service = asGlobalService(fn, "key");

    expect(fn).toHaveBeenCalled();
    expect(service).toBe("result");
  });

  test("returns the cached service if it has already been created", async () => {
    {
      const fn = vi.fn(() => "result");
      const service = asGlobalService(fn, "key");
  
      expect(fn).toHaveBeenCalled();
      expect(service).toBe("result");
    }
    {
      const fn = vi.fn(() => "result");
      const service = asGlobalService(fn, "key");
  
      expect(fn).toHaveBeenCalledTimes(0);
      expect(service).toBe("result");
    }
  });

  afterAll(() => {
    global.services.clear();
  });
});
