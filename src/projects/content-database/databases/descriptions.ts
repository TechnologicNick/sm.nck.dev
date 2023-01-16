import { FileId, LocalId } from "../types";

export type Description = {
  localId: LocalId;
  fileId: FileId
  name?: string;
  description?: string;
  type?: "Blocks and Parts" | "Custom Game" | Omit<string, "Blocks and Parts" | "Custom Game">;
  [key: string]: unknown;
}

export const descriptions = new Map<LocalId, Description>();

export const reloadDescriptions = async () => {
  const response = await fetch("https://raw.githubusercontent.com/TechnologicNick/scrap-mechanic-mod-scraper/master/mod/Scripts/data/descriptions.json");
  const data: Record<LocalId, Description> = await response.json();
  descriptions.clear();
  for (const description of Object.values(data)) {
    descriptions.set(description.localId, description);
  }
}

export const findFileIdByLocalId = (localId: LocalId): FileId | null => {
  return descriptions.get(localId)?.fileId ?? null;
}
