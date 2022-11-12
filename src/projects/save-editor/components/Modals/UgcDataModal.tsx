import { Button, Modal, Row, Spacer, Text, Tooltip, useModal } from "@nextui-org/react";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { IUserGeneratedContent } from "@/save-editor/structures/user-generated-content";
import { ModalProps } from ".";
import { FieldHandle, SteamWorkshopField, UuidField } from "./Fields";
import { client } from "utils/trpc";
import Uuid from "@/save-editor/structures/uuid";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export interface UgcDataModalProps<T extends IUserGeneratedContent> extends ModalProps {
  ugcItem?: T;
  onUpdate: (newUgcItem: T) => void;
  type: "edit" | "add";
  onUnmount?: () => void;
}

const UnmountDetector = ({ onUnmount }: { onUnmount?: () => void }) => {
  useEffect(() => {
    return () => {
      onUnmount && onUnmount();
    }
  }, []);

  return <></>;
}

const UgcDataModal = <T extends IUserGeneratedContent,>({ ugcItem, onUpdate, modalRef, type, onUnmount, ...props }: UgcDataModalProps<T>) => {
  const { setVisible, visible, bindings } = useModal();
  useImperativeHandle(modalRef, () => ({
    setVisible,
    visible,
  }));

  const [fileIdError, setFileIdError] = useState<string | null>(null);
  const [localIdError, setLocalIdError] = useState<string | null>(null);
  const [inferFileIdDisabled, setInferFileIdDisabled] = useState(ugcItem?.localId === undefined);
  const [inferLocalIdDisabled, setInferLocalIdDisabled] = useState(ugcItem?.fileId === undefined);
  const fileIdField = useRef<FieldHandle<bigint>>(null);
  const localIdField = useRef<FieldHandle<Uuid>>(null);
  const [updateDisabled, setUpdateDisabled] = useState(type === "add");

  const values = useRef<Partial<IUserGeneratedContent>>({});
  const setValue = <K extends keyof IUserGeneratedContent>(key: K) => {
    return (value: IUserGeneratedContent[K] | undefined) => {
      values.current[key] = value;

      if ((fileIdError ?? localIdError) !== null) {
        setUpdateDisabled(true);
      } else if (type === "add") {
        setUpdateDisabled(values.current.localId === undefined || values.current.fileId === undefined);
      }
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
      {...bindings}
      {...props}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          {capitalizeFirstLetter(type)} mod
        </Text>
        <UnmountDetector onUnmount={onUnmount} />
      </Modal.Header>
      <Modal.Body>
        <SteamWorkshopField
          initialValue={ugcItem?.fileId}
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
                  const localId = values.current.localId ?? ugcItem?.localId;
                  if (localId === undefined) {
                    throw new Error("Local Id is required");
                  }

                  const description = await client.modDatabase.descriptions.byLocalId.query(localId.toString());
                  if (!description) {
                    throw new Error("No description found");
                  }

                  fileIdField.current?.setValue(description.fileId);
                  setValue("fileId")(description.fileId);
                } catch (err: any) {
                  setFileIdError(`Inference failed: ${err.message}`);
                }
              }}
            >
              Infer
            </Button>
          </Tooltip>
        </SteamWorkshopField>
        <Row css={{ alignItems: "flex-end", paddingBottom: 10 }}>
          <UuidField
            initialValue={ugcItem?.localId}
            onChange={(value) => {
              setLocalIdError(null);
              setInferFileIdDisabled(value === undefined);
              setValue("localId")(value);
            }}
            label="Local Id"
            errorText={localIdError ?? undefined}
            fieldRef={localIdField}
            allowUnsafe
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
                  const fileId = values.current.fileId ?? ugcItem?.fileId;
                  if (fileId === undefined) {
                    throw new Error("File Id is required");
                  }

                  const description = await client.modDatabase.descriptions.byFileId.query(fileId);
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
        <Button auto disabled={updateDisabled} onClick={() => update()}>
          {type === "add" ? "Add" : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UgcDataModal;
