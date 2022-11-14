import { Container, Spacer } from "@nextui-org/react";
import { useState } from "react";
import DownloadSave from "@/save-editor/components/DownloadSave";
import OpenLocalSave from "@/save-editor/components/OpenLocalSave";
import SaveBrowser from "@/save-editor/components/SaveBrowser";
import SaveEditor from "@/save-editor/save-editor";
import type { Page } from "pages/_app";
import { Sidebar, SidebarLink } from "components/navigation/Sidebar";
import NoSsr from "utils/NoSsr";
import { BrowserRouter, useMatch, useNavigate } from "react-router-dom";

const SaveEditorPage: Page = () => {
  const [saveEditor, setSaveEditor] = useState<SaveEditor>();
  const isRoot = useMatch("/");
  const navigate = useNavigate();

  const onOpen = async (file: File) => {
    // Make sure we don't stay on the root page
    if (isRoot) {
      navigate("/players", { replace: true });
    }

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
  return (
    <Sidebar title="Save Editor">
      <SidebarLink to={"game"}>Game</SidebarLink>
      <SidebarLink to={"players"}>Players</SidebarLink>
      <SidebarLink to={"mods"}>Mods</SidebarLink>
    </Sidebar>
  );
}

SaveEditorPage.Wrapper = ({ children }) => {
  return (
    <NoSsr>
      <BrowserRouter basename="/save-editor">
        {children}
      </BrowserRouter>
    </NoSsr>
  );
}

export default SaveEditorPage;
