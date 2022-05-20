import { Button, Input } from "@nextui-org/react";
import { ChangeEvent, MutableRefObject, useRef } from "react";

const OpenLocalSave = ({ onOpen }: { onOpen: (file: File) => void }) => {
  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    Array.from(event.target.files!).forEach(file => onOpen(file));
  }

  const ref = useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept=".db"
        onChange={onSelectFile}
        style={{ display: "none" }}
      />
      <Button onClick={() => ref.current.click()}>Open local save</Button>
    </>
  );
}

export default OpenLocalSave;
