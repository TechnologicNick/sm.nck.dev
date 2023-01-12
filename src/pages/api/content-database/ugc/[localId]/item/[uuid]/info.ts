import { NextApiRequest, NextApiResponse } from 'next'
import { getManifestByFileId, ensureDatabaseLoaded, getFilesFromManifest, getFileFromManifest } from 'projects/content-database/content-database';
import { descriptions } from 'projects/content-database/databases/descriptions';
import { localIdSchema, uuidSchema } from 'projects/content-database/types';
import stripJsonComments from 'strip-json-comments';
import { z } from 'zod';

const querySchema = z.object({
  localId: localIdSchema,
  uuid: uuidSchema,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = querySchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error });
    return;
  }

  await ensureDatabaseLoaded();

  const description = descriptions[query.data.localId];
  if (!description) {
    res.status(404).json({ error: "LocalId not found" });
    return;
  }

  const manifest = await getManifestByFileId(description.fileId);

  const buffer = await getFileFromManifest(manifest, "Gui\\Language\\English\\inventoryDescriptions.json");
  if (!buffer) {
    res.status(404).json({ error: "inventoryDescriptions.json not found" });
    return;
  }

  let inventoryDescriptions: Record<string, any>;
  try {
    inventoryDescriptions = JSON.parse(stripJsonComments(buffer.toString()));
  } catch (error) {
    res.status(500).json({ error: "inventoryDescriptions.json is not valid JSON" });
    return;
  }

  const inventoryDescription = inventoryDescriptions[query.data.uuid];
  if (!inventoryDescription) {
    res.status(404).json({ error: "UUID not found in inventoryDescriptions.json" });
    return;
  }

  res.status(200).json({
    inventoryDescription,
  });
}

export default handler;
