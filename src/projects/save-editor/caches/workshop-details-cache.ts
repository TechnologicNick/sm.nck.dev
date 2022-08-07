import NodeCache from "node-cache";
import type { WorkshopDetails } from "pages/api/save-editor/workshop-details";

export const detailsCache = new NodeCache({
  stdTTL: 60 * 60,
});

export const fetchDetails = async (ids: (bigint | string)[]): Promise<{ [id: string]: WorkshopDetails }> => {
  if (ids.length === 0) {
    return Promise.resolve({});
  }

  const params = new URLSearchParams({
    ids: ids.map(id => `${id}`).join(','),
  });

  const data = await fetch(`/api/save-editor/workshop-details?${params}`);
  return await data.json();
}

export const cacheMissingDetails = async (ids: (bigint | string)[]) => {
  const missing = ids.map(id => `${id}`).filter(id => !detailsCache.has(id));
  const fetched = await fetchDetails(missing);

  detailsCache.mset(
    Object.entries(fetched)
      .map(([publishedFileId, details]) => ({ key: publishedFileId, val: details }))
  );

  missing.filter(id => !fetched[id]).forEach(id => {
    detailsCache.set(id, null, 10 * 60);
  });

  return detailsCache.mget<WorkshopDetails | null>(ids.map(id => `${id}`));
}
