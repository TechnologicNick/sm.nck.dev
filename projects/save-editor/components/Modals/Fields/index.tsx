export { default as SteamId64Field } from "./SteamId64Field";

export interface FieldProps<T> {
  initialValue: T;
  onChange: (value: T | undefined) => void;
}
