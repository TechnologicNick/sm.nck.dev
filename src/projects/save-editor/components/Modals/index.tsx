import { ModalProps as MP } from "@nextui-org/react";

export interface ModalProps extends MP {
  modalRef?: React.MutableRefObject<{
    setVisible: (visible: boolean) => void;
    visible: boolean;
  }>;
}
