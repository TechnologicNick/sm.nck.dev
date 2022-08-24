import { t } from "server/trpc";
import { z } from "zod";

export const DESCRIPTIONS_URL = "https://raw.githubusercontent.com/TechnologicNick/scrap-mechanic-mod-scraper/master/mod/Scripts/data/descriptions.json";

export const descriptions = new Map<string, {
  creatorId?: string,
  description?: string,
  fileId: bigint,
  localId: string,
  name?: string,
  type?: "Blocks and Parts" | "Custom Game" | Omit<string, "Blocks and Parts" | "Custom Game">;
  [key: string]: any;
}>();

const fileIdToLocalId = new Map<string, string>();

export const update = async () => {
  console.log("Updating descriptions...");
  
  const newDescriptions: Record<string, {
    creatorId?: string,
    description?: string,
    fileId: number,
    localId: string,
    name?: string,
    type?: string,
  }> = await fetch(DESCRIPTIONS_URL).then(res => res.json());
  
  descriptions.clear();
  for (const [localId, description] of Object.entries(newDescriptions)) {
    try {
      fileIdToLocalId.set(`${description.fileId}`, localId);
      descriptions.set(localId, {
        ...description,
        fileId: BigInt(description.fileId),
        localId: localId,
      });
    } catch (err: any) {
      console.log(`Failed to parse description for ${localId}:`, err.message);
    }
  }

  console.log("Amount of descriptions found:", descriptions.size);

  fileIdToLocalId.clear();
  for (const [localId, { fileId }] of descriptions.entries()) {
    fileIdToLocalId.set(`${fileId}`, localId);
  }
}

let lastUpdate: Date | null = null;
const updateIfNeeded = async () => {
  if (lastUpdate && lastUpdate.getTime() + 1000 * 60 * 60 * 24 > new Date().getTime()) {
    return;
  }

  await update();
  
  lastUpdate = new Date();
}

const descriptionsRouter = t.router({
  byFileId: t.procedure
    .input(
      z.union([
        z.string(),
        z.bigint(),
      ])
    )
    .query(async ({ input }) => {
      await updateIfNeeded();

      const localId = fileIdToLocalId.get(`${input}`);
      if (!localId) {
        return null;
      }

      return descriptions.get(localId) ?? null;
    }),
  byLocalId: t.procedure
    .input(z.string())
    .query(async ({ input }) => {
      await updateIfNeeded();

      return descriptions.get(input) ?? null;
    }),
});

export const modDatabaseRouter = t.router({
  descriptions: descriptionsRouter,
});
