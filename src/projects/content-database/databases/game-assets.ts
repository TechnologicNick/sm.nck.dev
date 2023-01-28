import stripJsonComments from "strip-json-comments";
import { InternalServerError, NotFoundError } from "utils/errors";
import { entries, entryNotNullish } from "utils/type-helpers";
import { getFileFromManifest, getFilesFromManifest, getManifestByDepot, getManifestIdByDepot } from "../content-database";
import { GameMode, Uuid } from "../types";

export type Shapeset = Map<`$${"GAME_DATA" | "SURVIVAL_DATA" | "CHALLENGE_DATA"}/Objects/Database/ShapeSets/${string}`, Set<Uuid>>;

const DEPOT_DATA = 387992;

export const gameShapesets = {
  creative: new Map() as Shapeset,
  survival: new Map() as Shapeset,
  challenge: new Map() as Shapeset,
} as const;

let depotDataManifestId: Awaited<ReturnType<typeof getManifestIdByDepot>> | null = null;

export const reloadGameAssets = async () => {
  if (depotDataManifestId == await getManifestIdByDepot(DEPOT_DATA)) {
    return;
  }

  await Promise.all([
    reloadGameShapesets(),
    reloadItemDescriptions(),
  ]);
}

const reloadGameShapesets = async () => {
  const manifest = await getManifestByDepot(DEPOT_DATA);
  const shapesetFiles = await getFilesFromManifest(manifest, [
    "Data\\Objects\\Database\\ShapeSets\\shapesets.json",
    "Survival\\Objects\\Database\\ShapeSets\\shapesets.json",
    "ChallengeData\\Objects\\Database\\ShapeSets\\shapesets.json",
  ] as const);

  const [
    creativeShapesets,
    survivalShapesets,
    challengeShapesets,
  ] = await Promise.all([
    parseShapesetsJson(shapesetFiles["Data\\Objects\\Database\\ShapeSets\\shapesets.json"]!),
    parseShapesetsJson(shapesetFiles["Survival\\Objects\\Database\\ShapeSets\\shapesets.json"]!),
    parseShapesetsJson(shapesetFiles["ChallengeData\\Objects\\Database\\ShapeSets\\shapesets.json"]!),
  ]);

  gameShapesets.creative.clear();
  gameShapesets.survival.clear();
  gameShapesets.challenge.clear();

  for (const [key, value] of creativeShapesets) {
    gameShapesets.creative.set(key, value);
  }

  for (const [key, value] of survivalShapesets) {
    gameShapesets.survival.set(key, value);
  }

  for (const [key, value] of challengeShapesets) {
    gameShapesets.challenge.set(key, value);
  }
}

const resolveContentPath = (contentPath: string) => {
  contentPath = contentPath.replaceAll("/", "\\");

  if (contentPath.startsWith("$GAME_DATA")) {
    return contentPath.replace("$GAME_DATA", "Data");
  } else if (contentPath.startsWith("$SURVIVAL_DATA")) {
    return contentPath.replace("$SURVIVAL_DATA", "Survival");
  } else if (contentPath.startsWith("$CHALLENGE_DATA")) {
    return contentPath.replace("$CHALLENGE_DATA", "ChallengeData");
  } else {
    throw new Error(`Invalid content path: ${contentPath}`);
  }
}

export const parseShapesetsJson = async (file: Buffer) => {
  const shapesets: Shapeset = new Map();

  const json = JSON.parse(stripJsonComments(file.toString()));

  const manifest = await getManifestByDepot(DEPOT_DATA);
  const shapesetFiles = await getFilesFromManifest(manifest, json.shapeSetList.map(resolveContentPath));

  for (const [contentPath, shapesetFile] of Object.entries(shapesetFiles).filter(entryNotNullish)) {
    const shapeset = JSON.parse(stripJsonComments(shapesetFile.toString()));
    for (const listName of ["partList", "blockList"]) {
      if (shapeset[listName]) {
        const uuids = (shapeset[listName] as any[]).map((shape: any) => shape.uuid);
        shapesets.set(contentPath as any, new Set(uuids));
      }
    }
  }

  return shapesets;
}

export const findModeByUuid = (uuid: Uuid) => {
  const gameModes = new Set<GameMode>();

  for (const [gameMode, shapeset] of entries(gameShapesets)) {
    for (const [key, value] of shapeset) {
      if (value.has(uuid)) {
        gameModes.add(gameMode);
      }
    }
  }

  return gameModes;
}

export type InventoryDescription = {
  title?: string;
  description?: string;
  keywords?: string[];
}

const inventoryDescriptionPath = {
  creative: "Data\\Gui\\Language\\English\\InventoryItemDescriptions.json",
  survival: "Survival\\Gui\\Language\\English\\inventoryDescriptions.json",
  challenge: "ChallengeData\\Gui\\Language\\English\\inventoryDescriptions.json",
} as const satisfies Record<GameMode, string>;

const inventoryDescriptions = {
  creative: new Map<Uuid, InventoryDescription>(),
  survival: new Map<Uuid, InventoryDescription>(),
  challenge: new Map<Uuid, InventoryDescription>(),
} as const satisfies Record<GameMode, Record<string, any>>;

const reloadItemDescriptions = async () => {
  const [
    creativeDescriptions,
    survivalDescriptions,
    challengeDescriptions,
  ] = await Promise.all([
    getInventoryDescriptions("creative"),
    getInventoryDescriptions("survival"),
    getInventoryDescriptions("challenge"),
  ]);

  inventoryDescriptions.creative.clear();
  inventoryDescriptions.survival.clear();
  inventoryDescriptions.challenge.clear();

  for (const [key, value] of entries(creativeDescriptions)) {
    inventoryDescriptions.creative.set(key, value);
  }

  for (const [key, value] of entries(survivalDescriptions)) {
    inventoryDescriptions.survival.set(key, value);
  }

  for (const [key, value] of entries(challengeDescriptions)) {
    inventoryDescriptions.challenge.set(key, value);
  }
}

const getInventoryDescriptions = async (gameMode: GameMode) => {
  const manifest = await getManifestByDepot(DEPOT_DATA);

  const path = inventoryDescriptionPath[gameMode];
  const buffer = await getFileFromManifest(manifest, path);
  if (!buffer) {
    throw new NotFoundError(`${path} not found`);
  }

  let inventoryDescriptions: Record<Uuid, any>;
  try {
    inventoryDescriptions = JSON.parse(stripJsonComments(buffer.toString()));
  } catch (error) {
    throw new InternalServerError(`${path} is not valid JSON`);
  }

  return inventoryDescriptions;
}

export const getInventoryDescription = async (gameMode: GameMode, uuid: Uuid) => {
  const inventoryDescription = inventoryDescriptions[gameMode].get(uuid);
  if (!inventoryDescription) {
    throw new NotFoundError(`UUID not found in ${inventoryDescriptionPath[gameMode]}`);
  }

  return inventoryDescription;
}
