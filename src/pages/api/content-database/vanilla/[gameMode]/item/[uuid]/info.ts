import { NextApiRequest, NextApiResponse } from 'next'
import { ensureDatabaseLoaded } from 'projects/content-database/content-database';
import { getInventoryDescription } from 'projects/content-database/databases/game-assets';
import { GameMode, gameModeSchema, Uuid, uuidSchema } from 'projects/content-database/types';
import { handleHttpError } from 'utils/errors';
import { z } from 'zod';

const querySchema = z.object({
  gameMode: gameModeSchema,
  uuid: uuidSchema,
});

export const getInfo = async (gameMode: GameMode, uuid: Uuid) => {
  return {
    origin: {
      vanilla: {
        gameMode: gameMode,
      },
    },
    inventoryDescription: await getInventoryDescription(gameMode, uuid),
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = querySchema.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error });
    return;
  }

  await ensureDatabaseLoaded();

  try {
    const info = await getInfo(query.data.gameMode, query.data.uuid);
    
    res.status(200).json(info);
  } catch (error) {
    return handleHttpError(error, res);
  }
}

export default handler;