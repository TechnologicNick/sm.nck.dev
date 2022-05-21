import { Container } from "@nextui-org/react";
import SaveEditor from "../save-editor";
import PlayerDataGrid from "./DataGrids/PlayerDataGrid";

export interface SaveBrowserProps {
  saveEditor: SaveEditor;
}

const SaveBrowser = ({ saveEditor }: SaveBrowserProps) => {
  return (
    <Container fluid>
      <PlayerDataGrid saveEditor={saveEditor} />
    </Container>
  );
}

export default SaveBrowser;