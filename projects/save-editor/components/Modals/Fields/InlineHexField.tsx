import { Input, useInput } from "@nextui-org/react";
import { useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "../../../hooks";

const InlineHexField = ({ label, initialValue, onChange }: FieldProps<Buffer>) => {
  const initialValueString = Array.from(initialValue).map(byte => byte.toString(16).padStart(2, '0')).join(" ");
  const { value, reset, bindings } = useInput(initialValueString);

  const helper = useMemo((): any => {
    if (value.match(/[^0-9a-fA-F\s]/g)) {
      return {
        error: "Contains non-hexadecimal characters",
      }
    }

    const joined = value.replaceAll(/\s/g, "");
    
    if (value.length === 0) {
      return {}
    } else if (joined.length < initialValue.length * 2) {
      return {
        error: `Too short (${initialValue.length} bytes required, currently ${joined.length / 2})`,
      }
    } else if (joined.length > initialValue.length * 2) {
      return {
        error: `Too long (${initialValue.length} bytes required, currently ${joined.length / 2})`,
      }
    }

    return {
      valid: Buffer.from(joined, "hex"),
    }
  }, [value]);

  useNoInitialEffect(() => {
    onChange(helper.valid);
  }, [helper.valid])

  return (<>
    <Input
      {...bindings}
      clearable
      bordered
      fullWidth
      onClearClick={reset}
      helperColor={"error"}
      helperText={helper.error ?? ""}
      label={label}
      placeholder={initialValueString}
    />
  </>);
}

export default InlineHexField;
