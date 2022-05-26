import { CSS } from "@nextui-org/react";
import { IconBaseProps } from "react-icons";
import DeleteIcon from "./DeleteIcon";
import EditIcon from "./EditIcon";

export { default as EditIcon } from "./EditIcon";
export { default as DeleteIcon } from "./DeleteIcon";

export type AvailableIcons = "edit" | "delete";
export type IconProps = {
  icon: AvailableIcons,
} & Partial<IconBaseProps> & CSS;

export const Icon = (props: IconProps) => {
  switch(props.icon) {
    case "edit":
      return <EditIcon {...props} />
    case "delete":
      return <DeleteIcon {...props} />
  }
}
