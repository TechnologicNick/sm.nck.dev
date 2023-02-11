import { notNull, notUndefined } from "utils/type-helpers";
import { LocalId, Uuid } from "../types";
import { findFileIdByLocalId, findLocalIdByFileId } from "./descriptions";
import { publishedFileDetails } from "./published-file-details";

export type Shapeset = Record<`$CONTENT_${Uuid}/Objects/Database/ShapeSets/${string}`, Uuid[]>;

export const shapesets = new Map<LocalId, Shapeset>();

export const reloadShapesets = async () => {
  const response = await fetch("https://raw.githubusercontent.com/TechnologicNick/scrap-mechanic-mod-scraper/master/mod/Scripts/data/shapesets.json");
  const data: Record<LocalId, Shapeset> = await response.json();
  shapesets.clear();
  for (const [localId, shapeset] of Object.entries(data) as [LocalId, Shapeset][]) {
    shapesets.set(localId, shapeset);
  }
}

export const findLocalIdsByUuid = (uuid: Uuid, allowedLocalIds?: Set<LocalId>) => {
  const localIds: LocalId[] = [];

  for (const localId of (allowedLocalIds ?? shapesets.keys())) {
    const shapeset = shapesets.get(localId);
    if (!shapeset) {
      continue;
    }
    
    for (const [key, value] of Object.entries(shapeset)) {
      if (value.includes(uuid)) {
        localIds.push(localId);
      }
    }
  }

  return localIds;
}

export const findLocalIdByUuid = async (uuid: Uuid, allowedLocalIds?: Set<LocalId>) => {
  let localIds = findLocalIdsByUuid(uuid, allowedLocalIds);
  if (localIds.length <= 1) {
    return localIds[0] ?? null;
  }

  const sortedMods = localIds
    .map(localId => findFileIdByLocalId(localId))
    .filter(notNull)
    .map(fileId => publishedFileDetails.get(fileId))
    .filter(notUndefined)
    .sort((a, b) => b.subscriptions - a.subscriptions);

  return findLocalIdByFileId(Number(sortedMods[0]?.publishedfileid)) ?? null;
}
