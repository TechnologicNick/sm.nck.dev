import { Button, Modal, ModalProps, Spacer, Text, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useRef } from "react";
import Player, { IPlayer } from "../../structures/player";
import { FieldProps, SteamId64Field } from "./Fields";

export interface PlayerDataModalProps extends ModalProps {
  player: Player;
}

const PlayerDataModal = React.forwardRef(({ player, ...props }: PlayerDataModalProps, ref) => {
  const { setVisible, bindings } = useModal();
  useImperativeHandle(ref, () => ({
    setVisible,
  }));

  const values = useRef<Partial<IPlayer>>({});
  const setValue = <T extends keyof IPlayer>(key: T) => {
    return (value: IPlayer[T] | undefined) => {
      values.current![key] = value;
    }
  }
  const getFieldProps = <T extends keyof IPlayer>(key: T): FieldProps<IPlayer[T]> => {
    return {
      initialValue: player[key],
      onChange: setValue(key),
    }
  }

  return (
    <Modal closeButton aria-labelledby="modal-title" {...props} {...bindings}>
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Edit player
        </Text>
      </Modal.Header>
      <Modal.Body>
        <SteamId64Field {...getFieldProps("steamId64")} />
        <Spacer y={0.1} />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={() => setVisible(false)}>
          Close
        </Button>
        <Button auto>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default PlayerDataModal;
