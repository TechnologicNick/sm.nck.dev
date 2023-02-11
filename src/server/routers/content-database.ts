import { getInfo as getUgcInfo } from "pages/api/content-database/ugc/[localId]/item/[uuid]/info";
import { getInfo as getVanillaInfo } from "pages/api/content-database/vanilla/[gameMode]/item/[uuid]/info";
import { ensureDatabaseLoaded } from "projects/content-database/content-database";
import { descriptions, findLocalIdByFileId } from "projects/content-database/databases/descriptions";
import { findIconMapByUuid } from "projects/content-database/databases/game-assets";
import { findLocalIdByUuid } from "projects/content-database/databases/shapesets";
import { fileIdSchema, gameModeSchema, localIdSchema, uuidSchema } from "projects/content-database/types";
import { t } from "server/trpc";
import { z } from "zod";

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

const itemsRouter = t.router({
  info: databaseProcedure
    .input(z.object({
      uuid: uuidSchema,
      mods: z.array(localIdSchema),
      gameMode: gameModeSchema.optional(),
    }))
    .query(async ({ input }) => {
      const localId = await findLocalIdByUuid(input.uuid, new Set(input.mods));
      if (localId) {
        const modDescription = descriptions.get(localId);
        if (!modDescription) {
          return null;
        }
  
        return await getUgcInfo(modDescription, input.uuid);
      } else {
        const gameMode = input.gameMode ?? findIconMapByUuid(input.uuid);
        if (!gameMode) {
          return null;
        }

        return await getVanillaInfo(gameMode, input.uuid);
      }
    }),
});

export const contentDatabaseRouter = t.router({
  descriptions: descriptionsRouter,
  items: itemsRouter,
});
