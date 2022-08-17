import { Input, useInput } from "@nextui-org/react";
import { useImperativeHandle, useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";

const bufferToHex = (buffer: Buffer) => Array.from(buffer).map(byte => byte.toString(16).padStart(2, '0')).join(" ");

export interface InlineHexFieldProps extends FieldProps<Buffer> {
  length: number;
}

const InlineHexField = ({ label, initialValue, onChange, errorText, fieldRef, length }: InlineHexFieldProps) => {
  const initialValueString = bufferToHex(initialValue ?? Buffer.alloc(length));
  const { value, reset, bindings, setValue } = useInput(initialValueString);
  if (fieldRef) {
    useImperativeHandle(fieldRef, () => ({
      setValue: (value) => setValue(bufferToHex(value)),
    }));
  }

  const helper = useMemo((): any => {
    if (value.match(/[^0-9a-fA-F\s]/g)) {
      return {
        error: "Contains non-hexadecimal characters",
      }
    }

    const joined = value.replaceAll(/\s/g, "");
    
    if (value.length === 0) {
      return {}
    } else if (joined.length < length * 2) {
      return {
        error: `Too short (${length} bytes required, currently ${joined.length / 2})`,
      }
    } else if (joined.length > length * 2) {
      return {
        error: `Too long (${length} bytes required, currently ${joined.length / 2})`,
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
      helperText={errorText ?? helper.error ?? ""}
      label={label}
      placeholder={initialValueString}
    />
  </>);
}

export default InlineHexField;
