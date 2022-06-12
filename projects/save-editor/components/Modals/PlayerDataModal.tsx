import { Button, Input, Modal, ModalProps, Row, Spacer, Text, useInput, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useMemo, useState } from "react";
import Player from "../../structures/player";
import SteamProfileCell from "../DataGrids/Cells/SteamProfileCell";
import SteamID from "steamid";

export interface PlayerDataModalProps extends ModalProps {
  player: Player;
}

const PlayerDataModal = React.forwardRef(({ player, ...props }: PlayerDataModalProps, ref) => {
  const { setVisible, bindings } = useModal();
  useImperativeHandle(ref, () => ({
    setVisible,
  }));

  const InputSteamId64 = () => {
    const { value, reset, bindings } = useInput(`${player.steamId64}`);
    
    const helper = useMemo((): any => {
      try {
        const id = new SteamID(value)
        if (!id.isValid()) {
          return {
            error: "Invalid Steam ID",
          }
        } else if (!id.isValidIndividual()) {
          return {
            error: "Steam ID does not belong to an individual",
          }
        } else {
          return {
            validSteamId64: id.getSteamID64(),
          }
        }
      } catch (error) {
        return {
          error: "Invalid Steam ID",
        }
      }
    }, [value]);

    return (<>
      <Row css={{
        ".nextui-user-info": {
          "width": "calc(100% - 4 * var(--nextui-space-sm))",
          "*": {
            "width": "100%",
          }
        }
      }}>
        <SteamProfileCell steamId64={helper.validSteamId64} cacheMissing />
      </Row>
      <Input
        {...bindings}
        clearable
        bordered
        fullWidth
        onClearClick={reset}
        helperColor={"error"}
        helperText={helper.error ?? ""}
        label="Steam ID"
      />
      <Spacer y={0.1} />
    </>);
  }

  return (
    <Modal closeButton aria-labelledby="modal-title" {...props} {...bindings}>
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Edit player
        </Text>
      </Modal.Header>
      <Modal.Body>
        <InputSteamId64 />
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
