import { Button, Input, Modal, ModalProps, Text, useModal } from "@nextui-org/react";
import React, { useImperativeHandle } from "react";
import Player from "../../structures/player";

export interface PlayerDataModalProps extends ModalProps {
  player: Player;
}

const PlayerDataModal = React.forwardRef(({ player, ...props }: PlayerDataModalProps, ref) => {
  const { setVisible, bindings } = useModal();
  useImperativeHandle(ref, () => ({
    setVisible,
  }));

  return (
    <Modal closeButton {...props} {...bindings}>
      <Modal.Header>
        <Text size={18}>
          Edit player
        </Text>
      </Modal.Header>
      <Modal.Body>

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
