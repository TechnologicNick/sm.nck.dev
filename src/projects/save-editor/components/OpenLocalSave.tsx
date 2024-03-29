import { Button } from "@nextui-org/react";
import { ChangeEvent, MutableRefObject, useRef } from "react";
import { initSql } from "../save-editor";

const OpenLocalSave = ({ onOpen }: { onOpen: (file: File) => void }) => {
  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    Array.from(event.target.files!).forEach(file => onOpen(file));
    event.target.value = "";
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
      <Button onClick={() => {
        ref.current?.click();
        initSql(); // Prefetch the SQL WASM module
      }}>
        Open Local Save
      </Button>
    </>
  );
}

export default OpenLocalSave;
