import { Input, useInput } from "@nextui-org/react";
import { useImperativeHandle, useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";

export interface BigIntFieldProps extends FieldProps<bigint> {
  min?: bigint;
  max?: bigint;
}

const BigIntField = ({ label, initialValue, onChange, errorText, fieldRef, min, max }: BigIntFieldProps) => {
  const { value, reset, bindings, setValue } = useInput(`${initialValue ?? ""}`);
  if (fieldRef) {
    useImperativeHandle(fieldRef, () => ({
      setValue: (value) => setValue(`${value}`),
    }));
  }
  
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
      helperText={errorText ?? helper.error ?? ""}
      label={label}
      type="text"
    />
  </>);
}

export default BigIntField;
