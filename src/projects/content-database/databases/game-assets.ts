import stripJsonComments from "strip-json-comments";
import { InternalServerError, NotFoundError } from "utils/errors";
import { entries, entryNotNullish } from "utils/type-helpers";
import { getFileFromManifest, getFilesFromManifest, getManifestByDepot, getManifestIdByDepot } from "../content-database";
import { GameMode, Uuid } from "../types";
import { Bounds, parseResourceImageSet } from "../utils/mygui/resource-image-set";

export type Shapeset = Map<`$${"GAME_DATA" | "SURVIVAL_DATA" | "CHALLENGE_DATA"}/Objects/Database/ShapeSets/${string}`, Set<Uuid>>;

const DEPOT_DATA = 387992;

export const gameShapesets = {
  creative: new Map() as Shapeset,
  survival: new Map() as Shapeset,
  challenge: new Map() as Shapeset,
} as const;

let depotDataManifestId: Awaited<ReturnType<typeof getManifestIdByDepot>> | null = null;

export const reloadGameAssets = async () => {
  if (depotDataManifestId === await getManifestIdByDepot(DEPOT_DATA)) {
    return;
  }

  await Promise.all([
    reloadGameShapesets(),
    reloadItemDescriptions(),
    reloadIconMapBounds(),
    reloadIconMapPngs(),
  ]);
}

/* Shapesets */

const reloadGameShapesets = async () => {
  const manifest = await getManifestByDepot(DEPOT_DATA);
  const shapesetFiles = await getFilesFromManifest(manifest, [
    "Data\\Objects\\Database\\shapesets.json",
    "Survival\\Objects\\Database\\shapesets.json",
    "ChallengeData\\Objects\\Database\\shapesets.json",
  ] as const);

  const [
    creativeShapesets,
    survivalShapesets,
    challengeShapesets,
  ] = await Promise.all([
    parseShapesetsJson(shapesetFiles["Data\\Objects\\Database\\shapesets.json"]!),
    parseShapesetsJson(shapesetFiles["Survival\\Objects\\Database\\shapesets.json"]!),
    parseShapesetsJson(shapesetFiles["ChallengeData\\Objects\\Database\\shapesets.json"]!),
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
        const uuids = (shapeset[listName] as any[]).map((shape) => shape.uuid);
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

/* Inventory descriptions */

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

export const inventoryDescriptions = new Map<Uuid, InventoryDescription>();

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

  inventoryDescriptions.clear();

  for (const [key, value] of entries(creativeDescriptions)) {
    inventoryDescriptions.set(key, value);
  }

  for (const [key, value] of entries(survivalDescriptions)) {
    inventoryDescriptions.set(key, value);
  }

  for (const [key, value] of entries(challengeDescriptions)) {
    inventoryDescriptions.set(key, value);
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

export const getInventoryDescription = async (uuid: Uuid) => {
  const inventoryDescription = inventoryDescriptions.get(uuid);
  if (!inventoryDescription) {
    throw new NotFoundError("UUID not found in inventory descriptions");
  }

  return inventoryDescription;
}

/* Icons */

const iconMapXmlPath = {
  creative: "Data\\Gui\\IconMap.xml",
  survival: "Survival\\Gui\\IconMapSurvival.xml",
  challenge: "ChallengeData\\Gui\\IconMapChallenge.xml",
} as const satisfies Record<GameMode, string>;

export const gameIconMapBounds = {
  creative: new Map<Uuid, Bounds>(),
  survival: new Map<Uuid, Bounds>(),
  challenge: new Map<Uuid, Bounds>(),
} as const satisfies Record<GameMode, Map<Uuid, Bounds>>;

const reloadIconMapBounds = async () => {
  const [
    creativeIconMapBounds,
    survivalIconMapBounds,
    challengeIconMapBounds,
  ] = await Promise.all([
    getIconMapBounds("creative"),
    getIconMapBounds("survival"),
    getIconMapBounds("challenge"),
  ]);

  gameIconMapBounds.creative.clear();
  gameIconMapBounds.survival.clear();
  gameIconMapBounds.challenge.clear();

  for (const [key, value] of entries(creativeIconMapBounds)) {
    gameIconMapBounds.creative.set(key as Uuid, value);
  }

  for (const [key, value] of entries(survivalIconMapBounds)) {
    gameIconMapBounds.survival.set(key as Uuid, value);
  }

  for (const [key, value] of entries(challengeIconMapBounds)) {
    gameIconMapBounds.challenge.set(key as Uuid, value);
  }
}

const getIconMapBounds = async (gameMode: GameMode) => {
  const manifest = await getManifestByDepot(DEPOT_DATA);

  const xml = await getFileFromManifest(manifest, iconMapXmlPath[gameMode]);
  if (!xml) {
    throw new NotFoundError(`${iconMapXmlPath[gameMode]} not found`);
  }

  try {
    return parseResourceImageSet(xml);
  } catch (error) {
    throw new Error(`Failed to parse ${iconMapXmlPath[gameMode]}: ${error}`);
  }
}

const iconMapPngPath = {
  creative: "Data\\Gui\\IconMap.png",
  survival: "Survival\\Gui\\IconMapSurvival.png",
  challenge: "ChallengeData\\Gui\\IconMapChallenge.png",
} as const satisfies Record<GameMode, string>;

export const gameIconMapPngs = {
  creative: Buffer.alloc(0),
  survival: Buffer.alloc(0),
  challenge: Buffer.alloc(0),
} satisfies Record<GameMode, Buffer>;

const reloadIconMapPngs = async () => {
  const [
    creativeIconMapPng,
    survivalIconMapPng,
    challengeIconMapPng,
  ] = await Promise.all([
    getIconMapPng("creative"),
    getIconMapPng("survival"),
    getIconMapPng("challenge"),
  ]);

  gameIconMapPngs.creative = creativeIconMapPng;
  gameIconMapPngs.survival = survivalIconMapPng;
  gameIconMapPngs.challenge = challengeIconMapPng;
}

const getIconMapPng = async (gameMode: GameMode) => {
  const manifest = await getManifestByDepot(DEPOT_DATA);

  const png = await getFileFromManifest(manifest, iconMapPngPath[gameMode]);
  if (!png) {
    throw new NotFoundError(`${iconMapPngPath[gameMode]} not found`);
  }

  return png;
}
