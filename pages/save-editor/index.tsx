import { Container } from "@nextui-org/react";
import OpenLocalSave from "../../projects/save-editor/components/OpenLocalSave";

const SaveEditor = () => {
  const onOpen = (file: File) => {
    console.log(`Reading save file "${file.name}" (${file.size} bytes)`);
    file.arrayBuffer().then(console.log);
  }

  return (
    <Container>
      <OpenLocalSave onOpen={onOpen}/>
    </Container>
  );
}

export default SaveEditor;
