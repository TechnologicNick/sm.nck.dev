import { Input, Row, useInput } from "@nextui-org/react";
import { useEffect, useMemo } from "react";
import SteamID from "steamid";
import { FieldProps } from ".";
import SteamProfileCell from "../../DataGrids/Cells/SteamProfileCell";

const SteamId64Field = ({ initialValue, onChange }: FieldProps<bigint>) => {
  const { value, reset, bindings } = useInput(`${initialValue}`);
  
  const helper = useMemo((): any => {
    try {
      const id = new SteamID(value);
      if (!id.isValid()) {
        return {
          error: "Invalid Steam ID",
        }
      } else if (!id.isValidIndividual()) {
        return {
          error: "Steam ID does not belong to an individual",
        }
      } else {
        return {
          validSteamId64: id.getSteamID64(),
        }
      }
    } catch (error) {
      return {
        error: "Invalid Steam ID",
      }
    }
  }, [value]);

  useEffect(() => {
    onChange(helper.validSteamId64 !== undefined ? BigInt(helper.validSteamId64) : undefined);
  }, [helper.validSteamId64])

  return (<>
    <Row css={{
      ".nextui-user-info": {
        "width": "calc(100% - 4 * var(--nextui-space-sm))",
        "*": {
          "width": "100%",
        }
      }
    }}>
      <SteamProfileCell steamId64={helper.validSteamId64} cacheMissing />
    </Row>
    <Input
      {...bindings}
      clearable
      bordered
      fullWidth
      onClearClick={reset}
      helperColor={"error"}
      helperText={helper.error ?? ""}
      label="Steam ID"
    />
  </>);
}

export default SteamId64Field;
