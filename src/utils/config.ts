import { z } from "zod";

export default z.object({
  STEAM_API_KEY: z.string(),
  STEAM_USERNAME: z.string(),
  STEAM_PASSWORD: z.string(),
}).parse(process.env);
