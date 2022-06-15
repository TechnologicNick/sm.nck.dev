import { Container, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { BluePinkBackground } from "../../components/Backgrounds";
import DownloadSave from "../../projects/save-editor/components/DownloadSave";
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

  return (<>
    <BluePinkBackground />
    <Container css={{ pt: "$10" }}>
      <Lz4Context>
        {saveEditor ? (
          <SaveBrowser
            key={saveEditor.uuid.toString()}
            saveEditor={saveEditor}
            buttons={<>
              <OpenLocalSave onOpen={onOpen} />
              <Spacer />
              <DownloadSave saveEditor={saveEditor} />
            </>}
          />
        ) : (
          <OpenLocalSave onOpen={onOpen} />
        )}
      </Lz4Context>
    </Container>
  </>);
}

export default SaveEditorPage;
