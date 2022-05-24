import type { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";
import { URLSearchParams } from "url";

export interface PlayerSummary {
  steamId: string;
  personaName: string;
  profileUrl: string;
  avatar: string;
  avatarMedium: string;
  avatarFull: string;
}

const summaryCache = new NodeCache({
  stdTTL: 60 * 60,
});

export const fetchPlayerSummaries = async (steamIds: string[]): Promise<{ [steamId: string]: PlayerSummary }> => {
  const params = new URLSearchParams({
    key: process.env.STEAM_API_KEY!,
    steamids: steamIds.join(','),
  });

  const data = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?${params}`);
  const json = await data.json();

  return Object.fromEntries(json.response.players.map((player: any) => (
    [player.steamid, {
      steamId: player.steamid,
      personaName: player.personaname,
      profileUrl: player.profileurl,
      avatar: player.avatar,
      avatarMedium: player.avatarmedium,
      avatarFull: player.avatarfull,
    }]
  )));
}

export const getPlayerSummaries = async (steamIds: string[]) => {
  const found = summaryCache.mget<PlayerSummary>(steamIds);

  const missing = steamIds.filter(id => !found[id]);

  if (missing.length === 0) {
    return found;
  }

  const fetched = await fetchPlayerSummaries(missing);
  summaryCache.mset(
    Object.entries(fetched)
      .map(([steamId, summary]) => ({ key: steamId, val: summary }))
  );

  return {
    ...found,
    ...fetched,
  }
}

export default async (req: NextApiRequest, res: NextApiResponse<{ [steamId: string]: PlayerSummary }>) => {
  switch (req.method) {
    case "GET":
      let ids = (req.query.ids as string)?.split(',');

      if (!ids) {
        res.status(400).end(`No "ids" query`);
        break;
      }

      if (!ids.every(id => id.match(/^[0-9]{17}$/))) {
        res.status(400).end(`Id "${ids.find(id => !id.match(/^[0-9]{17}$/))}" does not match /^[0-9]{17}$/`);
        break;
      }

      res.status(200).json(await getPlayerSummaries(ids));
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method "${req.method}" not allowed`);
  }
}