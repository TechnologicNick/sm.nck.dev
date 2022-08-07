import NodeCache from "node-cache";
import type { PlayerSummary } from "pages/api/save-editor/player-summaries";

export const summaryCache = new NodeCache({
  stdTTL: 60 * 60,
});

export const fetchSummaries = async (ids: (bigint | string)[]): Promise<{ [id: string]: PlayerSummary }> => {
  if (ids.length === 0) {
    return Promise.resolve({});
  }

  const params = new URLSearchParams({
    ids: ids.map(id => `${id}`).join(','),
  });

  const data = await fetch(`/api/save-editor/player-summaries?${params}`);
  return await data.json();
}

export const cacheMissingSummaries = async (ids: (bigint | string)[]) => {
  const missing = ids.map(id => `${id}`).filter(id => !summaryCache.has(id));
  const fetched = await fetchSummaries(missing);

  summaryCache.mset(
    Object.entries(fetched)
      .map(([steamId, summary]) => ({ key: steamId, val: summary }))
  );

  missing.filter(id => !fetched[id]).forEach(id => {
    summaryCache.set(id, null, 10 * 60);
  });

  return summaryCache.mget<PlayerSummary | null>(ids.map(id => `${id}`));
}
