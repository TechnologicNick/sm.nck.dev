import { Container, Spacer } from "@nextui-org/react";
import { useState } from "react";
import DownloadSave from "@/save-editor/components/DownloadSave";
import OpenLocalSave from "@/save-editor/components/OpenLocalSave";
import SaveBrowser, { isSaveBrowserPath } from "@/save-editor/components/SaveBrowser";
import SaveEditor from "@/save-editor/save-editor";
import type { Page } from "pages/_app";
import { Sidebar, SidebarLink } from "components/navigation/Sidebar";
import Head from "next/head";
import { useRouter } from "next/router";

const SaveEditorPage: Page = () => {
  const [saveEditor, setSaveEditor] = useState<SaveEditor>();
  const router = useRouter();
  const isRoot = router.asPath === "/save-editor";
  const subPath = ((router.query.page ?? []) as string[]).join("/");
  const saveBrowserPath = isSaveBrowserPath(subPath) ? subPath : "game";

  const onOpen = async (file: File) => {
    // Make sure we don't stay on the root page
    if (isRoot) {
      router.replace("/save-editor/game");
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
    <Container fluid css={{ pt: "$10" }}>
      <Head>
        <title>Save Editor - nck.dev</title>
        <meta name="description" content="Modify your Scrap Mechanic save files in the browser!" />
      </Head>
      {saveEditor ? (
        <SaveBrowser
          key={saveEditor.uuid.toString()}
          saveEditor={saveEditor}
          path={saveBrowserPath}
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
          minHeight: "calc(100vh - $$navbarHeight)",
          pointerEvents: "none",
        }}>
          <OpenLocalSave onOpen={onOpen} />
        </Container>
      )}
    </Container>
  );
}

SaveEditorPage.Sidebar = () => {
  return (
    <Sidebar title="Save Editor" css={{
      "@mdMax": {
        display: "none",
      },
    }}>
      <SidebarLink href={"/save-editor/game"}>Game</SidebarLink>
      <SidebarLink href={"/save-editor/players"}>Players</SidebarLink>
      <SidebarLink href={"/save-editor/mods"}>Mods</SidebarLink>
      <SidebarLink href={"/save-editor/worlds"}>Worlds</SidebarLink>
      <SidebarLink href={"/save-editor/containers"}>Containers</SidebarLink>
    </Sidebar>
  );
}

export default SaveEditorPage;
