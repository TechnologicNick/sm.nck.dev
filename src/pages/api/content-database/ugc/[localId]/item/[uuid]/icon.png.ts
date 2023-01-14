import { NextApiRequest, NextApiResponse } from 'next';
import { ensureDatabaseLoaded } from 'projects/content-database/content-database';
import { descriptions } from 'projects/content-database/databases/descriptions';
import { FileId, localIdSchema, Uuid, uuidSchema } from 'projects/content-database/types';
import { z } from 'zod';
import { Bounds, getIconMap } from '../../icon-map';
import { getIconMapPng } from '../../icon-map.png';
import { PNG } from 'pngjs';
import NodeCache from 'node-cache';
import withCache from 'utils/with-cache';

const querySchema = z.object({
  localId: localIdSchema,
  uuid: uuidSchema,
});

const parsedIconMapPngCache = new NodeCache({
  stdTTL: 60 * 60,
  useClones: false,
});

const getParsedIconMapPng = async (fileId: FileId) => {
  const cacheKey = fileId;
  const cached = parsedIconMapPngCache.get<PNG>(cacheKey);
  if (cached) {
    return cached;
  }

  const buffer = await getIconMapPng(fileId);
  if (!buffer) {
    return null;
  }

  const png = PNG.sync.read(buffer);
  parsedIconMapPngCache.set(cacheKey, png);

  return png;
}

const cropIcon = (parsedIconMapPng: PNG, bounds: Bounds) => {
  const icon = new PNG({ width: bounds.w, height: bounds.h });
  PNG.bitblt(parsedIconMapPng, icon, bounds.x, bounds.y, bounds.w, bounds.h, 0, 0);

  return PNG.sync.write(icon);
}

export const getIconPng = withCache(async (fileId: FileId, uuid: Uuid) => {
  const [
    parsedIconMapPng,
    iconMap,
  ] = await Promise.all([
    getParsedIconMapPng(fileId),
    getIconMap(fileId),
  ]);

  if (!parsedIconMapPng || !iconMap || !iconMap[uuid]) {
    return null;
  }

  const bounds = iconMap[uuid];
  return cropIcon(parsedIconMapPng, bounds);
}, (fileId, uuid) => `${fileId}/${uuid}`);

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

  const buffer = await getIconPng(description.fileId, query.data.uuid);
  if (!buffer) {
    res.status(404).json({ error: "Icon not found" });
    return;
  }

  res.status(200)
    .setHeader("Cache-Control", "public, max-age=3600")
    .setHeader("Content-Type", "image/png")
    .send(buffer);
}

export default handler;
