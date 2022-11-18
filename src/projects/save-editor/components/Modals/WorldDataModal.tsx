import { Button, Modal, Row, Text, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useRef, useState } from "react";
import { IWorld } from "@/save-editor/structures/world";
import { ModalProps } from ".";
import { NumberField, StringField, TextareaField } from "./Fields";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export interface WorldDataModalProps extends ModalProps {
  world?: IWorld;
  onUpdate: (newWorld: IWorld) => void;
  type: "edit" | "add";
}

const WorldDataModal = ({ world, onUpdate, modalRef, type, ...props }: WorldDataModalProps) => {
  const { setVisible, visible, bindings } = useModal();
  useImperativeHandle(modalRef, () => ({
    setVisible,
    visible,
  }));

  const [updateDisabled, setUpdateDisabled] = useState(type === "add");

  const values = useRef<Partial<IWorld>>({});
  const setValue = <K extends keyof IWorld>(key: K) => {
    return (value: IWorld[K] | undefined) => {
      values.current[key] = value;

      if (type === "add") {
        setUpdateDisabled(values.current.filename === undefined || values.current.classname === undefined);
      }
    }
  }
  const getFieldProps = <K extends keyof IWorld>(key: K) => {
    return {
      initialValue: world?.[key],
      onChange: setValue(key),
    }
  }

  const update = () => {
    const updatedFields = Object.entries(values.current).filter(([, value]) => value !== undefined)

    const newWorld = Object.assign(Object.create(null), world, Object.fromEntries(updatedFields));
    onUpdate(newWorld);

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
          {capitalizeFirstLetter(type)} world
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <StringField {...getFieldProps("filename")} label="Script Filename" />
        </Row>
        <Row>
          <StringField {...getFieldProps("classname")} label="Script Classname" />
        </Row>
        <Row>
          <NumberField {...getFieldProps("seed")} label="Seed" {...uint32} />
        </Row>
        <Row>
          <TextareaField {...getFieldProps("terrainParams")} label="Script Data" allowEmpty />
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

export default WorldDataModal;
