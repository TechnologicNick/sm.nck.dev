import { Input, useInput } from "@nextui-org/react";
import { useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";

export interface NumberFieldProps extends FieldProps<number> {
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
}

const NumberField = ({ label, initialValue, onChange, errorText, min, max, step, integer }: NumberFieldProps) => {
  const { value, reset, bindings } = useInput(`${integer ? Math.round(initialValue) : initialValue}`);
  
  const helper = useMemo((): any => {
    try {
      const parsedValue = integer ? parseInt(value) : parseFloat(value);
      if (isNaN(parsedValue)) {
        return {
          error: "Invalid number",
        }
      } else if (min !== undefined && parsedValue < min) {
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
        error: `Invalid ${integer ? "integer" : "number"}`,
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
      helperText={helper.error ?? errorText ?? ""}
      label={label}
      type="number"
      min={min}
      max={max}
      step={step}
    />
  </>);
}

export default NumberField;
