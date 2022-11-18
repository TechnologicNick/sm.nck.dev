import { Input, useInput } from "@nextui-org/react";
import { useImperativeHandle, useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";

export interface StringFieldProps extends FieldProps<string> {
}

const StringField = ({ label, initialValue, onChange, errorText, fieldRef }: StringFieldProps) => {
  const { value, reset, bindings, setValue } = useInput(`${initialValue ?? ""}`);
  if (fieldRef) {
    useImperativeHandle(fieldRef, () => ({
      setValue: (value) => setValue(value.toString()),
    }));
  }

  const helper = useMemo((): any => {
    if (value.length === 0) {
      return {
        valid: initialValue,
      }
    }

    return {
      valid: value,
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

export default StringField;
