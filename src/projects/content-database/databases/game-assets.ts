import stripJsonComments from "strip-json-comments";
import { entries, entryNotNullish } from "utils/type-helpers";
import { getFilesFromManifest, getManifestByDepot, getManifestIdByDepot } from "../content-database";
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

  await reloadGameShapesets();
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
