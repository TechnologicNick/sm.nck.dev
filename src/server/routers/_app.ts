import { steamRouter } from "server/routers/steam";
import { t } from "server/trpc";
import { contentDatabaseRouter } from "./content-database";

export const appRouter = t.router({
  steam: steamRouter,
  contentDatabase: contentDatabaseRouter,
});

export type AppRouter = typeof appRouter;
