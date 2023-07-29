import { Button, Modal, Row, Text, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useRef, useState } from "react";
import { IItemStack } from "@/save-editor/structures/item-stack";
import { ModalProps } from ".";
import { NumberField, UuidField } from "./Fields";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export interface ItemStackDataModalProps extends ModalProps {
  itemStack?: IItemStack;
  onUpdate: (newItemStack: IItemStack) => void;
  type: "edit" | "add";
}

const ItemStackDataModal = ({ itemStack, onUpdate, modalRef, type, ...props }: ItemStackDataModalProps) => {
  const { setVisible, visible, bindings } = useModal();
  useImperativeHandle(modalRef, () => ({
    setVisible,
    visible,
  }));

  const [updateDisabled, setUpdateDisabled] = useState(type === "add");

  const values = useRef<Partial<IItemStack>>({});
  const setValue = <K extends keyof IItemStack>(key: K) => {
    return (value: IItemStack[K] | undefined) => {
      values.current[key] = value;

      if (type === "add") {
        setUpdateDisabled(values.current.uuid === undefined);
      }
    }
  }
  const getFieldProps = <K extends keyof IItemStack>(key: K) => {
    return {
      initialValue: itemStack?.[key],
      onChange: setValue(key),
    }
  }

  const update = () => {
    const updatedFields = Object.entries(values.current).filter(([, value]) => value !== undefined)

    const newItemStack = Object.assign(Object.create(null), itemStack, Object.fromEntries(updatedFields));
    onUpdate(newItemStack);

    values.current = {};
    setVisible(false);
  }

  const uint32 = {
    min: 0,
    max: 0xFFFFFFFF,
    step: 1,
  }

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      width="460px"
      {...bindings}
      {...props}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          {capitalizeFirstLetter(type)} item stack
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <UuidField {...getFieldProps("uuid")} label="UUID" />
        </Row>
        <Row>
          <NumberField {...getFieldProps("quantity")} label="Quantity" {...uint32} />
        </Row>
        <Row>
          <NumberField {...getFieldProps("instanceId")} label="Tool Instance ID (0xFFFFFFFF for non-tools)" {...uint32} />
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={() => setVisible(false)}>
          Close
        </Button>
        <Button auto disabled={updateDisabled} onClick={() => update()}>
          {type === "add" ? "Add" : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemStackDataModal;
