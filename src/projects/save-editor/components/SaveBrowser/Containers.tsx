import { cacheMissingSummaries } from "@/save-editor/caches/player-summary-cache";
import { usePlayerSummary } from "@/save-editor/hooks";
import SaveEditor from "@/save-editor/save-editor";
import ContainerStructure from "@/save-editor/structures/container";
import ItemStack from "@/save-editor/structures/item-stack";
import Player from "@/save-editor/structures/player";
import { Card, Collapse, Container, Row, Spacer, Text } from "@nextui-org/react";
import { ReactNode } from "react";

export interface ContainersProps {
  saveEditor: SaveEditor;
  buttons?: ReactNode;
}

export interface ContainerSlotProps {
  slot: number;
  item: ItemStack;
}

export const ContainerSlot = ({ slot, item }: ContainerSlotProps) => {
  const isEmpty = item.isEmpty();
  if (isEmpty) {
    return (
      <Card variant="bordered" css={{
        borderTop: "1px solid $border !important",
      }}>
        <Card.Body>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      isPressable={!isEmpty}
      isHoverable={!isEmpty}
      variant="bordered"
      css={{
        borderTop: "1px solid $border !important",
      }}
    >
      <Card.Body>
      </Card.Body>
      <Card.Footer>
        <Text>{item.uuid.toString()}</Text>
      </Card.Footer>
    </Card>
  );
}

export interface ContainerDisplayProps {
  container: ContainerStructure;
  owner?: Player;
}

export const ContainerDisplay = ({ container, owner }: ContainerDisplayProps) => {
  const summary = usePlayerSummary(owner?.steamId64 ?? null);
  const ownerName = summary !== "loading" && summary !== "error" ? summary.personaName : owner?.steamId64 ?? null;

  return (
    <Collapse
      title={`Container #${container.id}`}
      subtitle={owner ? `${ownerName}'s inventory` : undefined}
      expanded={owner !== undefined}
    >
      <Container fluid css={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        gap: "$md",
      }}>
        {container.items.map((item, slot) => (
          <ContainerSlot key={slot} slot={slot} item={item} />
        ))}
      </Container>
    </Collapse>
  );
}

const Containers = ({ saveEditor, buttons }: ContainersProps) => {
  const containers = saveEditor.getAllContainers();
  const playerInventories = new Map<number, Player>();
  try {
    const players = saveEditor.getAllPlayers();
    for (const player of players) {
      playerInventories.set(player.inventoryContainerId, player);
    }
    cacheMissingSummaries(players.map(player => player.steamId64));
  } catch (error) {
    console.error("Failed to get player inventories:", error);
  }

  return (
    <>
      <Container fluid css={{
        "@mdMax": {
          "button": {
            minWidth: "fit-content",
          },
        }
      }}>
        <Row justify="space-between">
          <Row fluid={false}>
            {buttons}
          </Row>
          <Spacer x={1} />
          <Row fluid={false}>
          </Row>
        </Row>
      </Container>
      <Spacer y={1} />
      <Container>
        <Text h1>
          Containers
        </Text>
      </Container>
      <Collapse.Group splitted>
        {containers.map((container) => {
          const player = playerInventories.get(container.id);

          return (
            <ContainerDisplay
              key={container.id}
              container={container}
              owner={player}
            />
          );
        })}
      </Collapse.Group>
    </>
  );
}

export default Containers;
