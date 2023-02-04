import { NextApiRequest, NextApiResponse } from 'next'
import { ensureDatabaseLoaded } from 'projects/content-database/content-database';
import { getIconPng } from 'projects/content-database/databases/game-assets';
import { gameModeSchema, uuidSchema } from 'projects/content-database/types';
import { z } from 'zod';

const querySchema = z.object({
  gameMode: gameModeSchema,
  uuid: uuidSchema,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = querySchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error });
    return;
  }

  await ensureDatabaseLoaded();

  const buffer = await getIconPng(query.data.gameMode, query.data.uuid);
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