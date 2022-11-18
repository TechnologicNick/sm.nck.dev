import { Textarea, useInput } from "@nextui-org/react";
import { useImperativeHandle, useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";

export interface TextareaFieldProps extends FieldProps<string> {
  allowEmpty?: boolean;
}

const TextareaField = ({ label, initialValue, onChange, errorText, fieldRef, allowEmpty }: TextareaFieldProps) => {
  const { value, bindings, setValue } = useInput(`${initialValue ?? ""}`);
  if (fieldRef) {
    useImperativeHandle(fieldRef, () => ({
      setValue: (value) => setValue(value.toString()),
    }));
  }

  const helper = useMemo((): any => {
    if (value.length === 0 && !allowEmpty) {
      return {
        valid: initialValue,
      }
    }

    return {
      valid: value,
    }
  }, [value, allowEmpty]);

  useNoInitialEffect(() => {
    onChange(helper.valid);
  }, [helper.valid])

  return (<>
    <Textarea
      {...bindings}
      bordered
      fullWidth
      helperColor={"error"}
      helperText={errorText ?? helper.error ?? ""}
      label={label}
    />
  </>);
}

export default TextareaField;
