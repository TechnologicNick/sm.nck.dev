import { Button, Col, Collapse, Modal, Row, Spacer, Text, useModal } from "@nextui-org/react";
import React, { useImperativeHandle, useRef } from "react";
import Player, { IPlayer } from "@/save-editor/structures/player";
import { InlineHexField, NumberField, SteamId64Field } from "./Fields";
import { ModalProps } from ".";

export interface PlayerDataModalProps extends ModalProps {
  player: Player;
  onUpdate: (newPlayer: Player) => void;
}

export let currentlyExpanded: number | null = 1;

const PlayerDataModal = ({ player, onUpdate, modalRef, ...props }: PlayerDataModalProps) => {
  const { setVisible, visible, bindings } = useModal();
  useImperativeHandle(modalRef, () => ({
    setVisible,
    visible,
  }));

  const values = useRef<Partial<IPlayer>>({});
  const setValue = <T extends keyof IPlayer>(key: T) => {
    return (value: IPlayer[T] | undefined) => {
      values.current![key] = value;
    }
  }
  const getFieldProps = <K extends keyof IPlayer>(key: K) => {
    return {
      initialValue: player[key],
      onChange: setValue(key),
    }
  }

  const update = () => {
    const updatedFields = Object.entries(values.current).filter(([, value]) => value !== undefined)

    const newPlayer = new Player(Object.assign({}, player, Object.fromEntries(updatedFields)));
    onUpdate(newPlayer);

    values.current = {};
    setVisible(false);
  }

  const uint32 = {
    integer: true,
    min: 0,
    max: 0xFFFFFFFF,
  }

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      {...bindings}
      {...props}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Edit player
        </Text>
      </Modal.Header>
      <Modal.Body>
        <SteamId64Field {...getFieldProps("steamId64")} label="Steam Id">
          <Spacer x={1} />
          <Row fluid={false}>
            <NumberField {...getFieldProps("key")} label="Player Id" {...uint32} />
          </Row>
        </SteamId64Field>
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
            <NumberField {...getFieldProps("carryContainerId")} label="Carry Container Id" {...uint32} />
          </Collapse>
          <Collapse title="Unidentified" expanded={currentlyExpanded === 3}>
            <NumberField {...getFieldProps("unknown0x32")} label="Always 0xFFFFFFFF (bytes 0x32-0x35)" {...uint32} />
            <InlineHexField {...getFieldProps("unknown0x0E")} label="Unknown (bytes 0x0E - 0x19)" length={12} />
          </Collapse>
        </Collapse.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button auto color="secondary" onClick={() => setVisible(false)}>
          Close
        </Button>
        <Button auto onClick={() => update()}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlayerDataModal;
