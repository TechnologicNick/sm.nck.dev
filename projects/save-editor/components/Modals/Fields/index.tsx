export { default as SteamId64Field } from "./SteamId64Field";
export { default as NumberField } from "./NumberField";
export { default as InlineHexField } from "./InlineHexField";

export interface FieldProps<T> {
  label: string;
  initialValue: T;
  onChange: (value: T | undefined) => void;
}
