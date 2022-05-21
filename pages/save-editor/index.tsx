import { Container } from "@nextui-org/react";
import Script from "next/script";
import Lz4Context from "../../projects/save-editor/components/Lz4Context";
import OpenLocalSave from "../../projects/save-editor/components/OpenLocalSave";
import SaveEditor from "../../projects/save-editor/save-editor";

const SaveEditorPage = () => {
  const onOpen = async (file: File) => {
    console.log(`Opening local save file "${file.name}" (${file.size} bytes)`);
    const editor = new SaveEditor(file);
    await editor.loadDatabase();

    console.log("Save version:", editor.getVersion());
    console.log("Players:", editor.getAllPlayers());
  }

  return (
    <Container>
      <Lz4Context>
        <OpenLocalSave onOpen={onOpen}/>
      </Lz4Context>
    </Container>
  );
}

export default SaveEditorPage;
