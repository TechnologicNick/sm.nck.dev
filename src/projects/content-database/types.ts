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

export type Uuid = z.infer<typeof uuidSchema>;
export type LocalId = Uuid;
export type FileId = z.infer<typeof fileIdSchema>;
