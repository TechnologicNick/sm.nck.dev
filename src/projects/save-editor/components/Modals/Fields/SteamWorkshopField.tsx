import { Row } from "@nextui-org/react";
import { ReactNode, useState } from "react";
import { BigIntField, FieldProps } from ".";
import SteamWorkshopCell from "@/save-editor/components/DataGrids/Cells/SteamWorkshopCell";

export interface SteamWorkshopFieldProps extends FieldProps<bigint> {
  children?: ReactNode;
}

const SteamWorkshopField = ({ label, initialValue, onChange, errorText, children }: SteamWorkshopFieldProps) => {
  const [fileId, setFileId] = useState(initialValue);

  return (<>
    <Row css={{
      ".nextui-user-info": {
        "width": `calc(100% - 1 * var(--nextui-space-sm) - ${60 * 16 / 9 + 4}px)`,
        "& > *": {
          "width": "100%",
        }
      }
    }}>
      <SteamWorkshopCell fileId={fileId} cacheMissing compact />
    </Row>
    <Row css={{ alignItems: "flex-end" }}>
      <BigIntField
        label={label}
        initialValue={initialValue}
        onChange={(value) => {
          setFileId(value ?? initialValue);
          onChange(value);
        }}
        min={BigInt("0")}
        max={BigInt("0xFFFFFFFFFFFFFFFF")}
        errorText={errorText}
      />
      {children}
    </Row>
  </>);
}

export default SteamWorkshopField;
