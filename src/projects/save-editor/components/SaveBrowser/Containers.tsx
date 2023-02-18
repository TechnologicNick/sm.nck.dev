import { cacheMissingSummaries } from "@/save-editor/caches/player-summary-cache";
import { usePlayerSummary } from "@/save-editor/hooks";
import SaveEditor from "@/save-editor/save-editor";
import ContainerStructure from "@/save-editor/structures/container";
import ItemStack from "@/save-editor/structures/item-stack";
import Player from "@/save-editor/structures/player";
import { Card, Collapse, Container, CSS, Loading, Row, Spacer, Text } from "@nextui-org/react";
import Stack from "components/Stack";
import Image from "next/image";
import { GameMode, LocalId } from "projects/content-database/types";
import { ReactNode, useState } from "react";
import { trpc } from "utils/trpc";

export interface ContainersProps {
  saveEditor: SaveEditor;
  buttons?: ReactNode;
}

export interface ContainerSlotProps {
  slot: number;
  item: ItemStack;
  mods: LocalId[];
  gameMode?: GameMode;
}

export const ContainerSlot = ({ slot, item, mods, gameMode }: ContainerSlotProps) => {
  const isEmpty = item.isEmpty();
  const uuid = item.uuid.toString();

  const [hideIcon, setHideIcon] = useState(false);
  const [iconLoading, setIconLoading] = useState(false);

  const info = trpc.contentDatabase.items.info.useQuery({
    uuid,
    mods,
    gameMode,
  }, {
    enabled: !isEmpty,
    staleTime: Infinity,
  });

  const cardCss: CSS = {
    borderTop: "1px solid $border !important",
    minHeight: "$48",
  }

  if (isEmpty) {
    return (
      <Card variant="bordered" css={cardCss}>
        <Card.Body>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      isHoverable={!isEmpty}
      variant="bordered"
      css={cardCss}
    >
      <Card.Body css={{
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        paddingBlockStart: "$5",
      }}>
        <Stack streched css={{
          $$minHeight: "96px",
        }}>
          {(info.isLoading || iconLoading) && (
            <Loading size="xl" />
          )}
          {info.data && (
            <Image
              unoptimized
              src={info.data.icon}
              alt={(info.data && info.data.inventoryDescription.title) ? `Icon of ${info.data.inventoryDescription.title}` : "Icon"}
              width={96}
              height={96}
              style={{
                objectFit: "contain",
                display: hideIcon ? "none" : "block",
              }}
              onLoadStart={() => setIconLoading(true)}
              onLoadingComplete={() => {
                setHideIcon(false);
                setIconLoading(false);
              }}
              onError={() => {
                setHideIcon(true);
                setIconLoading(false);
              }}
            />
          )}
          <Text title="Quantity" css={{
            placeSelf: "end end",
            paddingInlineEnd: "$sm",
          }}>{item.quantity}</Text>
        </Stack>
      </Card.Body>
      <Card.Footer css={{
        flexDirection: "column",
        textAlign: "center",
      }}>
        <Text>{(info.data && info.data.inventoryDescription.title) ?? "???"}</Text>
        <Text small color="$accents7">{uuid}</Text>
      </Card.Footer>
    </Card>
  );
}

export interface ContainerDisplayProps {
  container: ContainerStructure;
  owner?: Player;
  mods: LocalId[];
  gameMode?: GameMode;
}

export const ContainerDisplay = ({ container, owner, mods, gameMode }: ContainerDisplayProps) => {
  const summary = usePlayerSummary(owner?.steamId64 ?? null);
  const ownerName = summary !== "loading" && summary !== "error" ? summary.personaName : owner?.steamId64 ?? null;

  return (
    <Collapse
      title={`Container #${container.id}`}
      subtitle={owner ? `${ownerName}'s inventory` : undefined}
      expanded={owner !== undefined}
    >
      <Container fluid css={{
        $$maxColumns: 10,
        $$itemMinWidth: "8rem",
        $$gap: "$space$md",
        $$gapCount: "calc($$maxColumns - 1)",
        $$totalGap: "calc($$gap * $$gapCount)",
        $$itemMaxWidth: "calc((100% - $$totalGap) / $$maxColumns)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(max($$itemMinWidth, $$itemMaxWidth), 1fr))",
        gap: "$$gap",
        paddingTop: "2px",
      }}>
        {container.items.map((item, slot) => (
          <ContainerSlot key={slot} slot={slot} item={item} mods={mods} gameMode={gameMode} />
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

  const mods = saveEditor.getUserGeneratedContent().map(mod => mod.localId.toString());

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
              mods={mods}
            />
          );
        })}
      </Collapse.Group>
    </>
  );
}

export default Containers;
