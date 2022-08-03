import { t } from "server/trpc";
import { z } from "zod";

const workshopRouter = t.router({
  search: t.procedure
    .input(
      z.object({
        searchText: z.string().nullish(),
        tags: z.array(z.enum([
          "Blueprint",
          "Blocks and Parts",
          "Tile",
          "Terrain Assets",
          "Challenge Pack",
          "World",
          "Custom Game",
        ])).nullish(),
        numberPerPage: z.number().min(1).max(100),
        cursor: z.string().default("*"),
      })
    )
    .query(async ({ input }) => {
      const params = new URLSearchParams();
      params.append("key", process.env.STEAM_API_KEY!);
      params.append("cursor", input.cursor);
      params.append("numperpage", `${input.numberPerPage}`);
      params.append("appid", "387990");
      params.append("return_tags", "true");
      params.append("return_details", "true");
      params.append("strip_description_bbcode", "true");
      params.append("match_all_tags", "false");

      input.tags?.forEach((tag, i) => {
        params.append(`requiredtags[${i}]`, tag);
      });

      if (input.searchText) {
        params.append("search_text", input.searchText);
        params.append("query_type", "12"); // k_PublishedFileQueryType_RankedByTextSearch
      } else {
        params.append("query_type", "9"); // k_PublishedFileQueryType_RankedByTotalUniqueSubscriptions
      }

      const response = await fetch(`https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?${params.toString()}`);

      return (await response.json()).response as QueryFilesResponse;
    })
});

export const steamRouter = t.router({
  workshop: workshopRouter,
});



export interface QueryFilesResponse {
  total:                number;
  publishedfiledetails: Publishedfiledetail[];
  next_cursor:          string;
}

export interface Publishedfiledetail {
  result:                       number;
  publishedfileid:              string;
  creator:                      string;
  creator_appid:                number;
  consumer_appid:               number;
  consumer_shortcutid:          number;
  filename:                     string;
  file_size:                    string;
  preview_file_size:            string;
  preview_url:                  string;
  url:                          string;
  hcontent_file:                string;
  hcontent_preview:             string;
  title:                        string;
  file_description:             string;
  time_created:                 number;
  time_updated:                 number;
  visibility:                   number;
  flags:                        number;
  workshop_file:                boolean;
  workshop_accepted:            boolean;
  show_subscribe_all:           boolean;
  num_comments_public:          number;
  banned:                       boolean;
  ban_reason:                   string;
  banner:                       string;
  can_be_deleted:               boolean;
  app_name:                     "Scrap Mechanic";
  file_type:                    number;
  can_subscribe:                boolean;
  subscriptions:                number;
  favorited:                    number;
  followers:                    number;
  lifetime_subscriptions:       number;
  lifetime_favorited:           number;
  lifetime_followers:           number;
  lifetime_playtime:            string;
  lifetime_playtime_sessions:   string;
  views:                        number;
  num_children:                 number;
  num_reports:                  number;
  tags: {
    tag:                        "Blueprint" | "Blocks and Parts" | "Tile" | "Terrain Assets" | "Challenge Pack" | "World" | "Custom Game";
    display_name:               string;
  }[];
  language:                     number;
  maybe_inappropriate_sex:      boolean;
  maybe_inappropriate_violence: boolean;
  revision_change_number:       string;
  revision:                     number;
  ban_text_check_result:        number;
}
