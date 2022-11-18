import { useEffect, useState } from "react";
import type { WorkshopDetails } from "pages/api/save-editor/workshop-details";
import { cacheMissingDetails, detailsCache } from "@/save-editor/caches/workshop-details-cache";

const useWorkshopDetails = (publishedFileId: bigint | string, requestMissing = false) => {
  const [details, setDetails] = useState<WorkshopDetails | "loading" | "error">("loading");

  useEffect(() => {
    const cached = detailsCache.get<WorkshopDetails | null>(`${publishedFileId}`);

    if (cached === null) {
      setDetails("error");
    } else if (cached) {
      setDetails(cached);
    } else if (requestMissing && publishedFileId !== "") {
      setDetails("loading");
      cacheMissingDetails([ publishedFileId ]).then((cachedDetails) => {
        setDetails(cachedDetails[`${publishedFileId}`] ?? "error");
      });
    } else {
      setDetails("error");
    }
  }, [publishedFileId, requestMissing])

  useEffect(() => {
    const listener = (keyPublishedFileId: string, valueWorkshopDetails: WorkshopDetails) => {
      if (keyPublishedFileId === `${publishedFileId}`) {
        setDetails(valueWorkshopDetails ?? "error");
      }
    }
    detailsCache.addListener("set", listener);
  
    return () => {
      detailsCache.removeListener("set", listener);
    }
  }, [publishedFileId]);
  
  return details;
}

export default useWorkshopDetails;
