import { useEffect, useState } from "react";
import { PlayerSummary } from "../../../pages/api/save-editor/player-summaries";
import { summaryCache } from "../caches/player-summary-cache";


const usePlayerSummary = (steamId: bigint | string) => {
  const [summary, setSummary] = useState<PlayerSummary | undefined>(summaryCache.get(`${steamId}`));

  useEffect(() => {
    const listener = (keySteamId: string, valuePlayerSummary: PlayerSummary) => {
      if (keySteamId === `${steamId}`) {
        setSummary(valuePlayerSummary);
      }
    }
    summaryCache.addListener("set", listener);
  
    return () => {
      summaryCache.removeListener("set", listener);
    }
  }, [steamId]);
  
  return summary;
}

export default usePlayerSummary;
