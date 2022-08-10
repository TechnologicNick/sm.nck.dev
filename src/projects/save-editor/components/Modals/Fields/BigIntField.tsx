import { Input, useInput } from "@nextui-org/react";
import { useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";

export interface BigIntFieldProps extends FieldProps<bigint> {
  min?: bigint;
  max?: bigint;
}

const BigIntField = ({ label, initialValue, onChange, errorText, min, max }: BigIntFieldProps) => {
  const { value, reset, bindings } = useInput(`${initialValue}`);
  
  const helper = useMemo((): any => {
    try {
      if (value.length === 0) {
        return {
          valid: initialValue,
        }
      }

      const parsedValue = BigInt(value);
      if (min !== undefined && parsedValue < min) {
        return {
          error: `Lower than ${min}`,
        }
      } else if (max !== undefined && parsedValue > max) {
        return {
          error: `Higher than ${max}`,
        }
      } else {
        return {
          valid: parsedValue,
        }
      }
    } catch (error) {
      return {
        error: "Invalid integer",
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
      helperText={helper.error ?? errorText ?? ""}
      label={label}
      type="text"
    />
  </>);
}

export default BigIntField;
