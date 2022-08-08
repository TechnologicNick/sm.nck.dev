import { Input, useInput } from "@nextui-org/react";
import { useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";
import Uuid from "@/save-editor/structures/uuid";

const BigIntField = ({ label, initialValue, onChange }: FieldProps<Uuid>) => {
  const { value, reset, bindings } = useInput(`${initialValue}`);
  
  const helper = useMemo((): any => {
    try {
      if (value.length === 0) {
        return {
          valid: initialValue,
        }
      }

      // TODO: Improve Uuid error reporting

      const parsedValue = Uuid.parse(value);
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
      helperText={helper.error ?? ""}
      label={label}
      type="text"
    />
  </>);
}

export default BigIntField;
