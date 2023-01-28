import { NextApiRequest, NextApiResponse } from 'next'
import { getManifestByFileId, ensureDatabaseLoaded, getFileFromManifest } from 'projects/content-database/content-database';
import { Description, descriptions } from 'projects/content-database/databases/descriptions';
import { FileId, localIdSchema, uuidSchema } from 'projects/content-database/types';
import stripJsonComments from 'strip-json-comments';
import { handleHttpError, InternalServerError, NotFoundError } from 'utils/errors';
import { z } from 'zod';

const querySchema = z.object({
  localId: localIdSchema,
  uuid: uuidSchema,
});

export const getInventoryDescription = async (fileId: FileId, uuid: string) => {
  const manifest = await getManifestByFileId(fileId);

  const buffer = await getFileFromManifest(manifest, "Gui\\Language\\English\\inventoryDescriptions.json");
  if (!buffer) {
    throw new NotFoundError("inventoryDescriptions.json not found");
  }

  let inventoryDescriptions: Record<string, any>;
  try {
    inventoryDescriptions = JSON.parse(stripJsonComments(buffer.toString()));
  } catch (error) {
    throw new InternalServerError("inventoryDescriptions.json is not valid JSON");
  }

  const inventoryDescription = inventoryDescriptions[uuid];
  if (!inventoryDescription) {
    throw new NotFoundError("UUID not found in inventoryDescriptions.json");
  }

  return inventoryDescription;
}

export const getInfo = async (description: Description, uuid: string) => {
  const { localId, fileId, name, type } = description;

  return {
    origin: {
      ugc: {
        localId,
        fileId,
        name,
        type,
      },
    },
    inventoryDescription: await getInventoryDescription(fileId, uuid),
  }
}

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

  try {
    const info = await getInfo(description, query.data.uuid);
    
    res.status(200).json(info);
  } catch (error) {
    return handleHttpError(error, res);
  }
}

export default handler;
