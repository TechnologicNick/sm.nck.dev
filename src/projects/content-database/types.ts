import { z } from "zod";

export const uuidSchema = z.custom<`${string}-${string}-${string}-${string}-${string}`>(
  (val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(`${val}`),
  (val) => ({ message: `${val} is not a valid UUID` }),
);
export const localIdSchema = z.custom<`${string}-${string}-${string}-${string}-${string}`>(
  (val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(`${val}`),
  (val) => ({ message: `${val} is not a valid LocalId` }),
);
export const fileIdSchema = z.number().min(0).max(0xffffffff);
export const gameModeSchema = z.union([z.literal("creative"), z.literal("survival"), z.literal("challenge")]);

export type Uuid = z.infer<typeof uuidSchema>;
export type LocalId = Uuid;
export type FileId = z.infer<typeof fileIdSchema>;
export type GameMode = z.infer<typeof gameModeSchema>;

export type SteamCdnChunk = {
  sha: string;
  crc: number;
  offset: `${number}`;
  cb_original: number;
  cb_compressed: number;
}

export type SteamCdnFile = {
  chunks: SteamCdnChunk[];
  filename: string; // Path separator is always backward slash
  size: `${number}`;
  flags: number;
  sha_filename: string;
  sha_content: string;
  linktarget: null;
}

export type SteamCdnManifest = {
  files: SteamCdnFile[];
  depot_id: number;
  gid_manifest: `${number}`;
  creation_time: number;
  filenames_encrypted: boolean;
  cb_disk_original: `${number}`;
  cb_disk_compressed: `${number}`;
  unique_chunks: number;
  crc_encrypted: number;
  crc_clear: number;
}
