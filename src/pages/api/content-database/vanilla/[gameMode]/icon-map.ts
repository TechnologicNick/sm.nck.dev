import { NextApiRequest, NextApiResponse } from 'next'
import { ensureDatabaseLoaded } from 'projects/content-database/content-database';
import { gameIconMapBounds } from 'projects/content-database/databases/game-assets';
import { gameModeSchema } from 'projects/content-database/types';
import { z } from 'zod';

const querySchema = z.object({
  gameMode: gameModeSchema,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = querySchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error });
    return;
  }

  await ensureDatabaseLoaded();

  const boundsMap = gameIconMapBounds[query.data.gameMode];
  const boundsObject = Object.fromEntries(boundsMap);

  res.status(200).json(boundsObject);
}

export default handler;
