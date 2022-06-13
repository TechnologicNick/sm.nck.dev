import { useEffect, useState } from "react";
import { PlayerSummary } from "../../../pages/api/save-editor/player-summaries";
import { cacheMissingSummaries, summaryCache } from "../caches/player-summary-cache";


const usePlayerSummary = (steamId: bigint | string, requestMissing = false) => {
  const [summary, setSummary] = useState<PlayerSummary | "loading" | "error">("loading");

  useEffect(() => {
    const cached = summaryCache.get<PlayerSummary>(`${steamId}`);
    if (cached) {
      setSummary(cached);
    } else if (requestMissing && steamId) {
      setSummary("loading");
      cacheMissingSummaries([ steamId ]).then((summaries) => {
        const summary = summaries[`${steamId}`];
        if (summary) {
          setSummary(summary);
        } else {
          setSummary("error");
        }
      });
    } else {
      setSummary("error");
    }
  }, [steamId])
  

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
