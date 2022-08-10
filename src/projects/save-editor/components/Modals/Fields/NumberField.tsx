import { Input, useInput } from "@nextui-org/react";
import { useImperativeHandle, useMemo } from "react";
import { FieldProps } from ".";
import { useNoInitialEffect } from "@/save-editor/hooks";

export interface NumberFieldProps extends FieldProps<number> {
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
}

const NumberField = ({ label, initialValue, onChange, errorText, fieldRef, min, max, step, integer }: NumberFieldProps) => {
  const { value, reset, bindings, setValue } = useInput(`${integer ? Math.round(initialValue) : initialValue}`);
  if (fieldRef) {
    useImperativeHandle(fieldRef, () => ({
      setValue: (value) => setValue(`${value}`),
    }));
  }
  
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
      helperText={errorText ?? helper.error ?? ""}
      label={label}
      type="number"
      min={min}
      max={max}
      step={step}
    />
  </>);
}

export default NumberField;
