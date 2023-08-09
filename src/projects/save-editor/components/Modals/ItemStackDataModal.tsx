import { Button, Modal, Row, Text, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useRef, useState } from "react";
import ItemStack, { IItemStack } from "@/save-editor/structures/item-stack";
import { ModalProps } from ".";
import { NumberField, UuidField } from "./Fields";
import { ContainerSlot } from "../SaveBrowser/Containers";
import { GameMode, LocalId } from "projects/content-database/types";
import ItemStackUuidField from "./Fields/ItemStackUuidFIeld";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export interface ItemStackDataModalProps extends ModalProps {
  itemStack?: IItemStack;
  mods: LocalId[];
  gameMode?: GameMode;
  onUpdate: (newItemStack: IItemStack) => void;
  type: "edit" | "add";
}

const ItemStackDataModal = ({ itemStack, mods, gameMode, onUpdate, modalRef, type, ...props }: ItemStackDataModalProps) => {
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
        <ItemStackUuidField {...getFieldProps("uuid")} label="UUID" mods={mods} gameMode={gameMode} />
        <Row>
          <NumberField {...getFieldProps("quantity")} label="Quantity" {...uint32} />
        </Row>
        <Row>
          <NumberField {...getFieldProps("instanceId")} label="Tool Instance ID (0xFFFFFFFF for non-tools)" {...uint32} />
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {type === "edit" && (
          <Button auto color="error" css={{ marginInlineEnd: "auto" }} onClick={() => {
            values.current = new ItemStack({});
            update();
          }}>
            Delete
          </Button>
        )}
        <Button auto color="secondary" onClick={() => setVisible(false)}>
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
