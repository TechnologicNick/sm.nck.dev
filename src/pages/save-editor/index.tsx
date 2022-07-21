import { Container, Spacer } from "@nextui-org/react";
import { useState } from "react";
import DownloadSave from "@/save-editor/components/DownloadSave";
import OpenLocalSave from "@/save-editor/components/OpenLocalSave";
import SaveBrowser from "@/save-editor/components/SaveBrowser";
import SaveEditor from "@/save-editor/save-editor";
import type { Page } from "pages/_app";
import { Sidebar } from "components/navigation/Sidebar";
import { useRouter } from "next/router";
import NoSsr from "util/NoSsr";

const SaveEditorPage: Page = () => {
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

  return (
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
  );
}

SaveEditorPage.Sidebar = () => {
  const router = useRouter();

  return (
    <Sidebar title="Save Editor">
      <NoSsr>
        Path: {(router.query.path as string[] ?? []).join("/")}
      </NoSsr>
    </Sidebar>
  );
}

export default SaveEditorPage;
