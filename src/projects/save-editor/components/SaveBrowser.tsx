import { Container } from "@nextui-org/react";
import React, { ReactNode } from "react";
import SaveEditor from "@/save-editor/save-editor";
import PlayerDataGrid from "./DataGrids/PlayerDataGrid";
import { Route, Routes } from "react-router-dom";

export interface SaveBrowserProps {
  saveEditor: SaveEditor;
  buttons?: ReactNode;
}

const SaveBrowser = ({ saveEditor, buttons }: SaveBrowserProps) => {
  return (
    <Container fluid>
      <Routes>
        <Route path="players" element={<PlayerDataGrid saveEditor={saveEditor} buttons={buttons} />} />
        <Route path="mods" element={"Mods"} />
      </Routes>
    </Container>
  );
}

export default SaveBrowser;