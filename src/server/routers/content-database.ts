import { ensureDatabaseLoaded } from "projects/content-database/content-database";
import { descriptions, findLocalIdByFileId } from "projects/content-database/databases/descriptions";
import { fileIdSchema, localIdSchema } from "projects/content-database/types";
import { t } from "server/trpc";

const databaseMiddleware = t.middleware(async ({ ctx, next }) => {
  await ensureDatabaseLoaded();
  
  return next();
});

const databaseProcedure = t.procedure.use(databaseMiddleware);

const descriptionsRouter = t.router({
  byFileId: databaseProcedure
    .input(fileIdSchema)
    .query(async ({ input }) => {
      const localId = findLocalIdByFileId(input);
      if (!localId) {
        return null;
      }

      return descriptions.get(localId) ?? null;
    }),
  byLocalId: databaseProcedure
    .input(localIdSchema)
    .query(async ({ input }) => {
      return descriptions.get(input) ?? null;
    }),
});

export const contentDatabaseRouter = t.router({
  descriptions: descriptionsRouter,
});
