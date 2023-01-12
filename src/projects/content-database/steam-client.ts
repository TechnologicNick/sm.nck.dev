import SteamUser from "steam-user";
import config from "utils/config";

const APP_ID = 387990;
const DATA_DEPOT = 387992;

export const user = new SteamUser();

// @ts-ignore
// user.on("debug", (message) => {
//   console.log("[Steam debug]", message);
// });

let loggedOnReject: ((reason?: any) => void) | null = null;
export let loggedOn: Promise<void> | null = null;

const login = () => {
  loggedOn = new Promise<void>((resolve, reject) => {
    user.once("loggedOn", async (details, parental) => {
      console.log(`Logged on to Steam as ${user.steamID?.getSteamID64()}`, { details, parental });

      try {
        const manifestId = (await user.getProductInfo([APP_ID], [], true)).apps[APP_ID].appinfo.depots[DATA_DEPOT].manifests.public;
        await (user as any).getManifest(APP_ID, DATA_DEPOT, manifestId, "public");
      } catch (error) {
        reject(new Error(`Failed to validate game ownership: ${error}`));
      }

      resolve();
    });
    loggedOnReject = reject;
  });
}

user.on("error", (error) => {
  console.error("Steam error:", error);
  loggedOnReject?.(error);
});

login();

user.logOn({
  accountName: config.STEAM_USERNAME,
  password: config.STEAM_PASSWORD,
  machineName: `sm.nck.dev - ${process.env.NODE_ENV}`
});
