import { steamRouter } from "server/routers/steam";
import { t } from "server/trpc";
import { modDatabaseRouter } from "./mod-database";

export const appRouter = t.router({
  steam: steamRouter,
  modDatabase: modDatabaseRouter,
});

export type AppRouter = typeof appRouter;
