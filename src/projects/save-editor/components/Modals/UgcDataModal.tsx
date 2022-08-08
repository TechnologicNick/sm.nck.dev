import { Button, Modal, Row, Text, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useRef } from "react";
import { IUserGeneratedContent } from "@/save-editor/structures/user-generated-content";
import { BigIntField } from "./Fields";
import { ModalProps } from ".";

export interface UgcDataModalProps<T extends IUserGeneratedContent> extends ModalProps {
  ugcItem: T;
  onUpdate: (newUgcItem: T) => void;
}

const UgcDataModal = <T extends IUserGeneratedContent,>({ ugcItem, onUpdate, modalRef, ...props }: UgcDataModalProps<T>) => {
  const { setVisible, bindings } = useModal();
  useImperativeHandle(modalRef, () => ({
    setVisible,
  }));

  const values = useRef<Partial<IUserGeneratedContent>>({});
  const setValue = <K extends keyof IUserGeneratedContent>(key: K) => {
    return (value: IUserGeneratedContent[K] | undefined) => {
      values.current![key] = value;
    }
  }
  const getFieldProps = <K extends keyof IUserGeneratedContent>(key: K) => {
    return {
      initialValue: ugcItem[key],
      onChange: setValue(key),
    }
  }

  const update = () => {
    const updatedFields = Object.entries(values.current).filter(([, value]) => value !== undefined)

    const newUgcItem = Object.assign({}, ugcItem, Object.fromEntries(updatedFields));
    onUpdate(newUgcItem);

    values.current = {};
    setVisible(false);
  }

  const uint64 = {
    min: BigInt("0"),
    max: BigInt("0xFFFFFFFFFFFFFFFF"),
  }

  return (
    <Modal closeButton aria-labelledby="modal-title" {...props} {...bindings}>
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Edit mod
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <BigIntField {...getFieldProps("fileId")} label="File Id" {...uint64} />
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={() => setVisible(false)}>
          Close
        </Button>
        <Button auto onClick={() => update()}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UgcDataModal;
