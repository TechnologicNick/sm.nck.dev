import { NextApiRequest, NextApiResponse } from "next"
import { ensureDatabaseLoaded } from "projects/content-database/content-database";
import { gameIconMapPngs } from "projects/content-database/databases/game-assets";
import { gameModeSchema } from "projects/content-database/types";
import { z } from "zod";

export const config = {
  api: {
    responseLimit: "8mb",
  },
}

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

  const buffer = gameIconMapPngs[query.data.gameMode];

  res.status(200)
    .setHeader("Cache-Control", "public, max-age=3600")
    .setHeader("Content-Type", "image/png")
    .send(buffer);
}

export default handler;
