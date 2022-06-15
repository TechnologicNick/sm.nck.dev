import { Container } from "@nextui-org/react";
import { ReactNode } from "react";
import SaveEditor from "../save-editor";
import PlayerDataGrid from "./DataGrids/PlayerDataGrid";

export interface SaveBrowserProps {
  saveEditor: SaveEditor;
  buttons?: ReactNode;
}

const SaveBrowser = ({ saveEditor, buttons }: SaveBrowserProps) => {
  return (
    <Container fluid>
      <PlayerDataGrid saveEditor={saveEditor} buttons={buttons} />
    </Container>
  );
}

export default SaveBrowser;