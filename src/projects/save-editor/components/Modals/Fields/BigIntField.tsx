import { Input, useInput } from "@nextui-org/react";
import { useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";

export interface BigIntFieldProps extends FieldProps<bigint> {
  min?: bigint;
  max?: bigint;
}

const BigIntField = ({ label, initialValue, onChange, min, max }: BigIntFieldProps) => {
  const { value, reset, bindings } = useInput(`${initialValue}`);
  
  const helper = useMemo((): any => {
    try {
      const parsedValue = BigInt(value);
      if (min && parsedValue < min) {
        return {
          error: `Lower than ${min}`,
        }
      } else if (max && parsedValue > max) {
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
      bordered
      fullWidth
      helperColor={"error"}
      helperText={helper.error ?? ""}
      label={label}
      type="text"
    />
  </>);
}

export default BigIntField;
