import { useEffect, useState } from "react";
import type { PlayerSummary } from "pages/api/save-editor/player-summaries";
import { cacheMissingSummaries, summaryCache } from "@/save-editor/caches/player-summary-cache";

const usePlayerSummary = (steamId: bigint | string | null, requestMissing = false) => {
  const [summary, setSummary] = useState<PlayerSummary | "loading" | "error">("loading");

  useEffect(() => {
    if (steamId === null) {
      setSummary("error");
      return;
    }

    const cached = summaryCache.get<PlayerSummary | null>(`${steamId}`);

    if (cached === null) {
      setSummary("error");
    } else if (cached) {
      setSummary(cached);
    } else if (requestMissing && steamId) {
      setSummary("loading");
      cacheMissingSummaries([ steamId ]).then((summaries) => {
        setSummary(summaries[`${steamId}`] ?? "error");
      });
    }
  }, [steamId])

  useEffect(() => {
    if (steamId === null) {
      return;
    }

    const listener = (keySteamId: string, valuePlayerSummary: PlayerSummary) => {
      if (keySteamId === `${steamId}`) {
        setSummary(valuePlayerSummary ?? "error");
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
