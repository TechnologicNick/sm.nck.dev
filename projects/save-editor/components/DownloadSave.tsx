import { Button } from "@nextui-org/react"
import { useRef } from "react";
import SaveEditor from "../save-editor";

export interface DownloadSaveProps {
  saveEditor: SaveEditor;
}

const DownloadSave = ({ saveEditor }: DownloadSaveProps) => {
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const save = () => {
    const blob = new Blob([ saveEditor.db.export() ]);
    anchorRef.current!.href = window.URL.createObjectURL(blob);
    anchorRef.current!.click();
  }

  const revoke = () => {
    window.URL.revokeObjectURL(anchorRef.current!.href);
  }

  return (
    <>
      <a
        ref={anchorRef}
        download={saveEditor.file.name}
        onClick={() => setTimeout(revoke, 1500)}
        style={{ display: "none" }}
      />
      <Button onClick={save} color="success">
        Download
      </Button>
    </>
  );
}

export default DownloadSave;
