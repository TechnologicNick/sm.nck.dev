import { Input, Row, useInput } from "@nextui-org/react";
import { ReactNode, useImperativeHandle, useMemo } from "react";
import SteamID from "steamid";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";
import SteamProfileCell from "@/save-editor/components/DataGrids/Cells/SteamProfileCell";

export interface SteamId64FieldProps extends FieldProps<bigint> {
  children: ReactNode;
}

const SteamId64Field = ({ label, initialValue, onChange, errorText, fieldRef, children }: SteamId64FieldProps) => {
  const { value, reset, bindings, setValue } = useInput(`${initialValue}`);
  if (fieldRef) {
    useImperativeHandle(fieldRef, () => ({
      setValue: (value) => setValue(`${value}`),
    }));
  }
  
  const helper = useMemo((): any => {
    try {
      if (value.length === 0) {
        return {
          validSteamId64: initialValue,
        }
      }

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

  useNoInitialEffect(() => {
    onChange(
      value.length !== 0 && helper.validSteamId64 !== undefined
        ? BigInt(helper.validSteamId64)
        : undefined
    );
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
    <Row>
      <Input
        {...bindings}
        clearable
        bordered
        fullWidth
        onClearClick={reset}
        helperColor={"error"}
        helperText={helper.error ?? errorText ?? ""}
        label={label}
        placeholder={`${initialValue}`}
      />
      {children}
    </Row>
  </>);
}

export default SteamId64Field;
