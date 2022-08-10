import { Button, Modal, Row, Spacer, Text, Tooltip, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useRef, useState } from "react";
import { IUserGeneratedContent } from "@/save-editor/structures/user-generated-content";
import { ModalProps } from ".";
import { FieldHandle, SteamWorkshopField, UuidField } from "./Fields";
import { clientProxy } from "utils/trpc";
import Uuid from "@/save-editor/structures/uuid";

export interface UgcDataModalProps<T extends IUserGeneratedContent> extends ModalProps {
  ugcItem: T;
  onUpdate: (newUgcItem: T) => void;
}

const UgcDataModal = <T extends IUserGeneratedContent,>({ ugcItem, onUpdate, modalRef, ...props }: UgcDataModalProps<T>) => {
  const { setVisible, bindings } = useModal();
  useImperativeHandle(modalRef, () => ({
    setVisible,
  }));

  const [fileIdError, setFileIdError] = useState<string | null>(null);
  const [localIdError, setLocalIdError] = useState<string | null>(null);
  const [inferFileIdDisabled, setInferFileIdDisabled] = useState(ugcItem.localId === undefined);
  const [inferLocalIdDisabled, setInferLocalIdDisabled] = useState(ugcItem.fileId === undefined);
  const fileIdField = useRef<FieldHandle<bigint>>(null);
  const localIdField = useRef<FieldHandle<Uuid>>(null);

  const values = useRef<Partial<IUserGeneratedContent>>({});
  const setValue = <K extends keyof IUserGeneratedContent>(key: K) => {
    return (value: IUserGeneratedContent[K] | undefined) => {
      values.current[key] = value;
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
    <Modal
      closeButton
      aria-labelledby="modal-title"
      width="460px"
      {...props}
      {...bindings}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Edit mod
        </Text>
      </Modal.Header>
      <Modal.Body>
        <SteamWorkshopField
          initialValue={ugcItem.fileId}
          onChange={(value) => {
            setFileIdError(null);
            setInferLocalIdDisabled(value === undefined);
            setValue("fileId")(value);
          }}
          label="File Id"
          errorText={fileIdError ?? undefined}
          fieldRef={fileIdField}
        >
          <Spacer x={1} />
          <Tooltip
            content="Infer File Id from the Steam Workshop (uses Local Id)"
            color="secondary"
            placement="topEnd"
            css={{ zIndex: 10000 }}
          >
            <Button
              auto
              bordered
              color="secondary"
              disabled={inferFileIdDisabled}
              onClick={async () => {
                try {
                  const description = await clientProxy.modDatabase.descriptions.byLocalId.query((values.current.localId ?? ugcItem.localId).toString());
                  if (!description) {
                    throw new Error("No description found");
                  }

                  fileIdField.current?.setValue(description.fileId);
                  setValue("fileId")(description.fileId);
                } catch (err: any) {
                  setLocalIdError(`Inference failed: ${err.message}`);
                }
              }}
            >
              Infer
            </Button>
          </Tooltip>
        </SteamWorkshopField>
        <Row css={{ alignItems: "flex-end", paddingBottom: 10 }}>
          <UuidField
            initialValue={ugcItem.localId}
            onChange={(value) => {
              setLocalIdError(null);
              setInferFileIdDisabled(value === undefined);
              setValue("localId")(value);
            }}
            label="Local Id"
            errorText={localIdError ?? undefined}
            fieldRef={localIdField}
          />
          <Spacer x={1} />
          <Tooltip
            content="Infer Local Id from the Steam Workshop (uses Local Id)"
            color="secondary"
            placement="topEnd"
            css={{ zIndex: 10000 }}
          >
            <Button
              auto
              bordered
              color="secondary"
              disabled={inferLocalIdDisabled}
              onClick={async () => {
                try {
                  const description = await clientProxy.modDatabase.descriptions.byFileId.query(values.current.fileId ?? ugcItem.fileId);
                  if (!description) {
                    throw new Error("No description found");
                  }
                  
                  const localId = Uuid.parse(description.localId);
                  localIdField.current?.setValue(localId);
                  setValue("localId")(localId);
                } catch (err: any) {
                  setLocalIdError(`Inference failed: ${err.message}`);
                }
              }}
            >
              Infer
            </Button>
          </Tooltip>
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
