import { Container } from "@nextui-org/react";
import React, { ReactNode } from "react";
import SaveEditor from "@/save-editor/save-editor";
import PlayerDataGrid from "./DataGrids/PlayerDataGrid";
import ModDataGrid from "./DataGrids/ModDataGrid";
import GameInfo from "./SaveBrowser/GameInfo";
import WorldDataGrid from "./DataGrids/WorldDataGrid";
import { z } from "zod";

const saveBrowserPathSchema = z.union([
  z.literal("game"),
  z.literal("players"),
  z.literal("mods"),
  z.literal("worlds")
]);

export type SaveBrowserPath = z.infer<typeof saveBrowserPathSchema>;

export const isSaveBrowserPath = (path: string): path is SaveBrowserPath => saveBrowserPathSchema.safeParse(path).success;

export interface SaveBrowserProps {
  saveEditor: SaveEditor;
  path: SaveBrowserPath;
  buttons?: ReactNode;
}

const SaveBrowser = ({ saveEditor, path, buttons }: SaveBrowserProps) => {
  return (
    <Container xl>
      {path === "game" && <GameInfo saveEditor={saveEditor} buttons={buttons} />}
      {path === "players" && <PlayerDataGrid saveEditor={saveEditor} buttons={buttons} />}
      {path === "mods" && <ModDataGrid saveEditor={saveEditor} buttons={buttons} />}
      {path === "worlds" && <WorldDataGrid saveEditor={saveEditor} buttons={buttons} />}
    </Container>
  );
}

export default SaveBrowser;