import { reloadDescriptions } from "./databases/descriptions";
import { EResult } from "steam-user";
import { FileId, SteamCdnFile, SteamCdnManifest } from "./types";
import { loggedOn, user } from "./steam-client";

const APP_ID = 387990;
const WORKSHOP_DEPOT = 387990;
const DATABASE_RELOAD_INTERVAL = 1 * 60 * 60 * 1000; // 1 hour
let lastDatabaseReload = 0;

export const reloadDatabase = async () => {
  await Promise.all([
    reloadDescriptions(),
  ]);

  console.log("Database reloaded");
}

export const ensureDatabaseLoaded = async () => {
  if (lastDatabaseReload < Date.now() - DATABASE_RELOAD_INTERVAL) {
    await reloadDatabase();
    lastDatabaseReload = Date.now();
  }
}

export const getManifestByFileId = async (publishedFileId: FileId) => {
  await loggedOn;
  const publishedFileDetails = await user.getPublishedFileDetails(publishedFileId);
  const { result, hcontent_file } = publishedFileDetails.files[publishedFileId];

  if (result !== EResult.OK) {
    throw new Error(`Could not get published file details: ${EResult[result]}`);
  }

  return (await (user as any).getManifest(APP_ID, WORKSHOP_DEPOT, hcontent_file, "public")).manifest as SteamCdnManifest;
}

export const getFileFromManifest = async (manifest: SteamCdnManifest, filename: string) => {
  await loggedOn;

  const file = manifest.files.find(file => file.filename === filename);
  if (!file) {
    return null;
  }

  return (await (user as any).downloadFile(APP_ID, manifest.depot_id, file)).file as Buffer;
}

export const getFilesFromManifest = async <T extends Readonly<string[]>>(manifest: SteamCdnManifest, files?: T | ((file: SteamCdnFile) => boolean)) => {
  await loggedOn;

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
    downloadedFiles[file.filename as keyof typeof downloadedFiles] = (await (user as any).downloadFile(APP_ID, manifest.depot_id, file)).file;
  }

  return downloadedFiles;
}
