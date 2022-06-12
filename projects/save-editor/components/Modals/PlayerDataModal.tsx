import { Button, Col, Modal, ModalProps, Row, Spacer, Text, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useRef } from "react";
import Player, { IPlayer } from "../../structures/player";
import { FieldProps, NumberField, SteamId64Field } from "./Fields";

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
  const getFieldProps = <T extends keyof IPlayer>(key: T) => {
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
        <SteamId64Field {...getFieldProps("steamId64")} label="Steam Id" />
        <Spacer y={1} />
        <Row>
          <Col>
            <NumberField {...getFieldProps("x")} label="X" />
          </Col>
          <Spacer x={1} />
          <Col>
            <NumberField {...getFieldProps("y")} label="Y" />
          </Col>
          <Spacer x={1} />
          <Col>
            <NumberField {...getFieldProps("z")} label="Z" />
          </Col>
        </Row>
        <Row>
          <Col>
            <NumberField {...getFieldProps("yaw")} label="Yaw" />
          </Col>
          <Spacer x={1} />
          <Col>
            <NumberField {...getFieldProps("pitch")} label="Pitch" />
          </Col>
        </Row>
        <Spacer y={1} />
        <NumberField {...getFieldProps("characterWorldId")} label="World Id" integer />
        <NumberField {...getFieldProps("inventoryContainerId")} label="Inventory Container Id" integer />
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
