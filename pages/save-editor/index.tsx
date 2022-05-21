import { Container } from "@nextui-org/react";
import { useState } from "react";
import Lz4Context from "../../projects/save-editor/components/Lz4Context";
import OpenLocalSave from "../../projects/save-editor/components/OpenLocalSave";
import SaveBrowser from "../../projects/save-editor/components/SaveBrowser";
import SaveEditor from "../../projects/save-editor/save-editor";

const SaveEditorPage = () => {
  const [saveEditor, setSaveEditor] = useState<SaveEditor>();

  const onOpen = async (file: File) => {
    console.log(`Opening local save file "${file.name}" (${file.size} bytes)`);
    const editor = new SaveEditor(file);
    await editor.loadDatabase();
    
    setSaveEditor(editor);
  }

  return (
    <Container>
      <Lz4Context>
        {saveEditor ? (
          <SaveBrowser saveEditor={saveEditor} />
        ) : (
          <OpenLocalSave onOpen={onOpen} />
        )}
      </Lz4Context>
    </Container>
  );
}

export default SaveEditorPage;
