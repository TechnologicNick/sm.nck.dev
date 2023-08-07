import { CSS } from "@nextui-org/react";
import { IconBaseProps } from "react-icons";

import AddIcon from "./AddIcon";
import EditIcon from "./EditIcon";
import DeleteIcon from "./DeleteIcon";

export { default as AddIcon } from "./AddIcon";
export { default as EditIcon } from "./EditIcon";
export { default as DeleteIcon } from "./DeleteIcon";

export type AvailableIcons = "add" | "edit" | "delete";
export type IconProps = {
  icon: AvailableIcons,
} & Partial<IconBaseProps> & CSS;

export const Icon = (props: IconProps) => {
  switch(props.icon) {
    case "add":
      return <AddIcon {...props} />
    case "edit":
      return <EditIcon {...props} />
    case "delete":
      return <DeleteIcon {...props} />
  }
}
