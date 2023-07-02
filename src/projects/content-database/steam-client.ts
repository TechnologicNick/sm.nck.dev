import SteamUser from "steam-user";
import config from "utils/config";

const APP_ID = 387990;
const DATA_DEPOT = 387992;

declare global {
  // eslint-disable-next-line no-var
  var steam: {
    user: SteamUser;
    loggedOn: Promise<void> | null;
  };
}

const login = () => {
  const user = new SteamUser();
  let loggedOnReject: ((reason?: any) => void) | null = null;

  user.on("error", (error) => {
    console.error("Steam error:", error);

    // If the login promise has been rejected, we don't want to try to log in again
    if (loggedOnReject) {
      loggedOnReject(error);
    } else {
      login();
    }
  });
  
  // @ts-ignore
  // user.on("debug", (message) => {
  //   console.log("[Steam debug]", message);
  // });

  user.logOn({
    accountName: config.STEAM_USERNAME,
    password: config.STEAM_PASSWORD,
    machineName: `sm.nck.dev - ${process.env.NODE_ENV}`
  });

  const loggedOn = new Promise<void>((resolve, reject) => {
    user.once("loggedOn", async (details, parental) => {
      console.log(`Logged on to Steam as ${user.steamID?.getSteamID64()} (${config.STEAM_USERNAME})`);

      try {
        const manifestId = (await user.getProductInfo([APP_ID], [], true)).apps[APP_ID].appinfo.depots[DATA_DEPOT].manifests.public.gid;
        await (user as any).getManifest(APP_ID, DATA_DEPOT, manifestId, "public");
      } catch (error) {
        reject(new Error(`Failed to validate game ownership: ${error}`));
      }

      loggedOnReject = null;
      resolve();
    });
    loggedOnReject = reject;
  });

  global.steam = {
    user,
    loggedOn,
  }
}

export const connectToSteam = async () => {
  if (!global.steam) {
    login();
  }

  await global.steam.loggedOn;
}

export const getSteamUser = () => {
  if (!global.steam?.user) {
    throw new Error("Steam not logged in");
  }

  return global.steam.user;
}

export const getLoggedOn = () => {
  if (!global.steam?.loggedOn) {
    throw new Error("Steam not logged in");
  }

  return global.steam.loggedOn;
}
