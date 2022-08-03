import { steamRouter } from "server/routers/steam";
import { t } from "server/trpc";

export const appRouter = t.router({
  steam: steamRouter,
});

export type AppRouter = typeof appRouter;
