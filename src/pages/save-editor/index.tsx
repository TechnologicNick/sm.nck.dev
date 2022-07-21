import { Container, Spacer } from "@nextui-org/react";
import { useState } from "react";
import { BluePinkBackground } from "components/Backgrounds";
import DownloadSave from "@/save-editor/components/DownloadSave";
import OpenLocalSave from "@/save-editor/components/OpenLocalSave";
import SaveBrowser from "@/save-editor/components/SaveBrowser";
import SaveEditor from "@/save-editor/save-editor";

const SaveEditorPage = () => {
  const [saveEditor, setSaveEditor] = useState<SaveEditor>();

  const onOpen = async (file: File) => {
    console.log(`Opening local save file "${file.name}" (${file.size} bytes)`);
    const editor = new SaveEditor(file);
    await editor.loadDatabase();

    // Expose the save editor to the developer console
    if (window !== undefined) {
      (window as any).editor = editor;
    }

    setSaveEditor(editor);
  }

  return (<>
    <BluePinkBackground />
    <Container css={{ pt: "$10" }}>
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
        <Container css={{
          d: "flex",
          jc: "center",
          ai: "center",
          fd: "column",
          position: "absolute",
          inset: 0,
          h: "100vh",
        }}>
          <OpenLocalSave onOpen={onOpen} />
        </Container>
      )}
    </Container>
  </>);
}

export default SaveEditorPage;
