import { ensureDatabaseLoaded } from "projects/content-database/content-database";
import { descriptions, findLocalIdByFileId } from "projects/content-database/databases/descriptions";
import { fileIdSchema, localIdSchema } from "projects/content-database/types";
import { t } from "server/trpc";

const descriptionsRouter = t.router({
  byFileId: t.procedure
    .input(fileIdSchema)
    .query(async ({ input }) => {
      await ensureDatabaseLoaded();

      const localId = findLocalIdByFileId(input);
      if (!localId) {
        return null;
      }

      return descriptions.get(localId) ?? null;
    }),
  byLocalId: t.procedure
    .input(localIdSchema)
    .query(async ({ input }) => {
      await ensureDatabaseLoaded();

      return descriptions.get(input) ?? null;
    }),
});

export const contentDatabaseRouter = t.router({
  descriptions: descriptionsRouter,
});
