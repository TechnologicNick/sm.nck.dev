import { NextApiRequest, NextApiResponse } from 'next'
import { getManifestByFileId, ensureDatabaseLoaded, getFileFromManifest } from 'projects/content-database/content-database';
import { descriptions } from 'projects/content-database/databases/descriptions';
import { FileId, localIdSchema } from 'projects/content-database/types';
import withCache from 'utils/with-cache';
import { z } from 'zod';

const querySchema = z.object({
  localId: localIdSchema,
});

export const getIconMapPng = withCache(async (fileId: FileId) => {
  const manifest = await getManifestByFileId(fileId);

  return await getFileFromManifest(manifest, "Gui\\IconMap.png");
}, (fileId) => fileId);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = querySchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error });
    return;
  }

  await ensureDatabaseLoaded();

  const description = descriptions.get(query.data.localId);
  if (!description) {
    res.status(404).json({ error: "LocalId not found" });
    return;
  }

  const buffer = await getIconMapPng(description.fileId);
  if (!buffer) {
    res.status(404).json({ error: "IconMap.png not found" });
    return;
  }

  res.status(200)
    .setHeader("Cache-Control", "public, max-age=3600")
    .setHeader("Content-Type", "image/png")
    .send(buffer);
}

export default handler;
