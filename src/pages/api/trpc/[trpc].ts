import { initTRPC } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";

export const t = initTRPC()();

export const appRouter = t.router({
});

// Type definition of API
export type AppRouter = typeof appRouter;

// API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
