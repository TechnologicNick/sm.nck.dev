import { reloadDescriptions } from "./databases/descriptions";

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
