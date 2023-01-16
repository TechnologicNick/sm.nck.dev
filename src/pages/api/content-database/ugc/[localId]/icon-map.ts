import { XMLParser } from 'fast-xml-parser';
import { NextApiRequest, NextApiResponse } from 'next'
import { getManifestByFileId, ensureDatabaseLoaded, getFileFromManifest } from 'projects/content-database/content-database';
import { descriptions } from 'projects/content-database/databases/descriptions';
import { FileId, localIdSchema } from 'projects/content-database/types';
import withCache from 'utils/with-cache';
import { z } from 'zod';

const querySchema = z.object({
  localId: localIdSchema,
});

const parser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name: string) => name === "Resource" || name === "Group",
});

export type Bounds = {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const getIconMap = withCache(async (fileId: FileId) => {
  const manifest = await getManifestByFileId(fileId);

  const xml = await getFileFromManifest(manifest, "Gui\\IconMap.xml");
  if (!xml) {
    return null;
  }

  try {
    const iconMap = parser.parse(xml.toString());

    const icons: Record<string, Bounds> = {};
    for (const resource of iconMap.MyGUI.Resource) {
      for (const group of resource.Group) {
        const [w, h] = group["@_size"].split(" ");
        for (const index of group.Index) {
          const [x, y] = index.Frame["@_point"].split(" ");
          icons[index["@_name"]] = {
            x: Number(x),
            y: Number(y),
            w: Number(w),
            h: Number(h),
          };
        }
      }
    }

    return icons;
  } catch (error) {
    throw new Error(`Failed to parse IconMap.xml: ${error}`);
  }
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

  try {
    const json = await getIconMap(description.fileId);
    if (!json) {
      res.status(404).json({ error: "IconMap.xml not found" });
      return;
    }
  
    res.status(200)
      .setHeader("Cache-Control", "public, max-age=3600")
      .json(json);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Failed to parse IconMap.xml:")) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default handler;
