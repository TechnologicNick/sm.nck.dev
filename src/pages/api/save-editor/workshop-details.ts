import type { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";
import { URLSearchParams } from "url";

export interface WorkshopDetails {
  publishedFileId: string;
  title: string;
  creatorId: string;
  appName: string;
  previewUrl: string;
}

const detailsCache = new NodeCache({
  stdTTL: 60 * 60,
});

export const fetchWorkshopDetails = async (publishedFileIds: string[]): Promise<{ [publishedFileId: string]: WorkshopDetails }> => {
  const params = new URLSearchParams({
    key: process.env.STEAM_API_KEY!,
  });
  publishedFileIds.forEach((publishedFileId, index) => {
    params.append(`publishedfileids[${index}]`, publishedFileId);
  });

  const data = await fetch(`https://api.steampowered.com/IPublishedFileService/GetDetails/v1/?${params}`);
  const json = await data.json();

  return Object.fromEntries(
    json.response.publishedfiledetails
      .filter((details: any) => details.result === 1) // k_EResultOK
      .map((details: any) => (
        [details.publishedfileid, {
          publishedFileId: details.publishedfileid,
          title: details.title,
          creatorId: details.creator,
          appName: details.app_name,
          previewUrl: details.preview_url,
        }]
      )
    )
  );
}

export const getWorkshopDetails = async (publishedFileIds: string[]) => {
  const found = detailsCache.mget<WorkshopDetails>(publishedFileIds);

  const missing = publishedFileIds.filter(id => !found[id]);

  if (missing.length === 0) {
    return found;
  }

  const fetched = await fetchWorkshopDetails(missing);
  detailsCache.mset(
    Object.entries(fetched)
      .map(([publishedFileId, details]) => ({ key: publishedFileId, val: details }))
  );

  return {
    ...found,
    ...fetched,
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<{ [publishedFileId: string]: WorkshopDetails }>) => {
  switch (req.method) {
    case "GET":
      let ids = (req.query.ids as string)?.split(',');

      if (!ids) {
        res.status(400).end(`No "ids" query`);
        break;
      }

      if (!ids.every(id => id.match(/^[0-9]+$/))) {
        res.status(400).end(`Id "${ids.find(id => !id.match(/^[0-9]+$/))}" does not match /^[0-9]+$/`);
        break;
      }

      res.status(200).json(await getWorkshopDetails(ids));
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method "${req.method}" not allowed`);
  }
}
