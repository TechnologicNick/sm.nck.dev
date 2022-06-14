import { Button, Col, Collapse, Modal, ModalProps, Row, Spacer, Text, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useRef } from "react";
import Player, { IPlayer } from "../../structures/player";
import { FieldProps, NumberField, SteamId64Field } from "./Fields";

export interface PlayerDataModalProps extends ModalProps {
  player: Player;
}

export let currentlyExpanded: number | null = 1;

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

  const uint32 = {
    integer: true,
    min: 0,
    max: 0xFFFFFFFF,
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
        <Collapse.Group
          onChange={(index, expanded) => {
            currentlyExpanded = expanded ? index! : null;
          }}
          css={{
            padding: 0,
            "& > * > *:last-child": {
              // Workaround to fix the border overflow being hidden
              // https://stackoverflow.com/a/6433475
              paddingInline: "2px",
            },
          }}
        >
          <Collapse title="Position" expanded={currentlyExpanded === 1}>
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
          </Collapse>
          <Collapse title="Ids" expanded={currentlyExpanded === 2}>
            <NumberField {...getFieldProps("characterWorldId")} label="World Id" {...uint32} />
            <NumberField {...getFieldProps("inventoryContainerId")} label="Inventory Container Id" {...uint32} />
          </Collapse>
          <Collapse title="Unidentified" expanded={currentlyExpanded === 3}>
            <NumberField {...getFieldProps("unknown0x2E")} label="Inventory Container Id +1 (bytes 0x2E-0x31)" {...uint32} />
            <NumberField {...getFieldProps("unknown0x32")} label="Always 0xFFFFFFFF (bytes 0x32-0x35)" {...uint32} />
          </Collapse>
        </Collapse.Group>
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
