import { Container } from "@nextui-org/react";
import OpenLocalSave from "../../projects/save-editor/components/OpenLocalSave";
import SaveEditor from "../../projects/save-editor/SaveEditor";

const SaveEditorPage = () => {
  const onOpen = async (file: File) => {
    console.log(`Opening local save file "${file.name}" (${file.size} bytes)`);
    const editor = new SaveEditor(file);
    await editor.loadDatabase();

    console.log("Save version:", editor.getVersion());
  }

  return (
    <Container>
      <OpenLocalSave onOpen={onOpen}/>
    </Container>
  );
}

export default SaveEditorPage;
