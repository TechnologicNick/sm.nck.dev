import { EResult } from "steam-user";
import withCache from "utils/with-cache";
import { reloadDescriptions } from "./databases/descriptions";
import { reloadGameAssets } from "./databases/game-assets";
import { reloadPublishedFileDetails } from "./databases/published-file-details";
import { reloadShapesets } from "./databases/shapesets";
import { connectToSteam, getSteamUser } from "./steam-client";
import { FileId, SteamCdnFile, SteamCdnManifest } from "./types";

const APP_ID = 387990;
const WORKSHOP_DEPOT = 387990;
const DATABASE_RELOAD_INTERVAL = 1 * 60 * 60 * 1000; // 1 hour
let lastDatabaseReload = 0;

export const reloadDatabase = async () => {
  await Promise.allSettled([
    reloadDescriptions().then(() => reloadPublishedFileDetails()),
    reloadShapesets(),
    reloadGameAssets(),
  ]);

  console.log("Database reloaded");
}

export const ensureDatabaseLoaded = async () => {
  if (lastDatabaseReload < Date.now() - DATABASE_RELOAD_INTERVAL) {
    const previousDatabaseReload = lastDatabaseReload;
    try {
      lastDatabaseReload = Date.now();
      await reloadDatabase();
    } catch (error) {
      lastDatabaseReload = previousDatabaseReload;
      throw error;
    }
  }
}

export const getManifestByFileId = withCache(async (publishedFileId: FileId) => {
  await connectToSteam();
  const publishedFileDetails = await getSteamUser().getPublishedFileDetails(publishedFileId);
  const { result, hcontent_file } = publishedFileDetails.files[publishedFileId];

  if (result !== EResult.OK) {
    throw new Error(`Could not get published file details: ${EResult[result]}`);
  }

  const manifest = (await (getSteamUser() as any).getManifest(APP_ID, WORKSHOP_DEPOT, hcontent_file, "public")).manifest as SteamCdnManifest;
  return manifest;
}, (publishedFileId) => publishedFileId);

export const getManifestIdByDepot = withCache(async (depotId: number) => {
  await connectToSteam();
  const manifestId = (await getSteamUser().getProductInfo([APP_ID], [], true)).apps[APP_ID].appinfo.depots[depotId].manifests.public.gid as `${number}`;
  return manifestId;
}, (depotId) => depotId);

export const getManifestByDepot = withCache(async (depotId: number) => {
  await connectToSteam();
  const manifestId = await getManifestIdByDepot(depotId);

  const manifest = (await (getSteamUser() as any).getManifest(APP_ID, depotId, manifestId, "public")).manifest as SteamCdnManifest;
  return manifest;
}, (depotId) => depotId);

const downloadFile = withCache(async (depotId: number, file: SteamCdnFile) => {
  await connectToSteam();
  const downloadedFile = (await (getSteamUser() as any).downloadFile(APP_ID, depotId, file)).file as Buffer;
  return downloadedFile;
}, (depotId, file) => file.sha_content);

export const getFileFromManifest = async (manifest: SteamCdnManifest, filename: string) => {
  await connectToSteam();

  const file = manifest.files.find(file => file.filename === filename);
  if (!file) {
    return null;
  }

  return await downloadFile(manifest.depot_id, file);
}

export const getFilesFromManifest = async <T extends Readonly<string[]>>(manifest: SteamCdnManifest, files?: T | ((file: SteamCdnFile) => boolean)) => {
  await connectToSteam();

  let filesToDownload = manifest.files;
  if (files) {
    if (typeof files === "function") {
      filesToDownload = filesToDownload.filter(files);
    } else {
      filesToDownload = filesToDownload.filter(file => files.includes(file.filename));
    }
  }

  const downloadedFiles: Partial<Record<T[number], Buffer>> = {};

  for (const file of filesToDownload) {
    downloadedFiles[file.filename as keyof typeof downloadedFiles] = await downloadFile(manifest.depot_id, file);
  }

  return downloadedFiles;
}
