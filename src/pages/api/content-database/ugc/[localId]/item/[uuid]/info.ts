import { NextApiRequest, NextApiResponse } from 'next'
import { ensureDatabaseLoaded } from 'projects/content-database/content-database';
import { descriptions } from 'projects/content-database/databases/descriptions';
import { localIdSchema, uuidSchema } from 'projects/content-database/types';
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

  res.status(200).json(description);
}

export default handler;
