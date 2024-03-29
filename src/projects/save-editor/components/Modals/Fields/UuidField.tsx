import { Input, useInput } from "@nextui-org/react";
import { useImperativeHandle, useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";
import Uuid from "@/save-editor/structures/uuid";

export interface UuidFieldProps extends FieldProps<Uuid> {
  allowUnsafe?: boolean;
}

const UuidField = ({ label, initialValue, onChange, errorText, fieldRef, allowUnsafe }: UuidFieldProps) => {
  const { value, reset, bindings, setValue } = useInput(`${initialValue ?? ""}`);
  if (fieldRef) {
    useImperativeHandle(fieldRef, () => ({
      setValue: (value) => setValue(value.toString()),
    }));
  }

  const helper = useMemo((): any => {
    try {
      if (value.length === 0) {
        return {
          valid: initialValue,
        }
      }

      // TODO: Improve Uuid error reporting

      const parsedValue = Uuid.parse(value, { unsafe: allowUnsafe });
      return {
        valid: parsedValue,
      }
    } catch (error) {
      return {
        error: "Invalid UUID",
      }
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
      type="text"
    />
  </>);
}

export default UuidField;
