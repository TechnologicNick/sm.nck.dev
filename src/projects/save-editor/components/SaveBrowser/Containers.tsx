import { cacheMissingSummaries } from "@/save-editor/caches/player-summary-cache";
import SaveEditor from "@/save-editor/save-editor";
import ContainerStructure from "@/save-editor/structures/container";
import ItemStack from "@/save-editor/structures/item-stack";
import Player from "@/save-editor/structures/player";
import { Card, Collapse, Container, CSS, Loading, Row, Spacer, Text } from "@nextui-org/react";
import Stack from "components/Stack";
import Image from "next/image";
import { PlayerSummary } from "pages/api/save-editor/player-summaries";
import { GameMode, LocalId } from "projects/content-database/types";
import { ReactNode, useEffect, useState } from "react";
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
        overflowY: "visible",
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
          {item.instanceId !== 0xFFFFFFFF && (
            <Text title="Instance ID" css={{
              placeSelf: "end start",
              paddingInlineStart: "$sm",
              translate: "0px $space$md",
            }}>{item.instanceId} <Text small color="$accents7">ID</Text></Text>
          )}
          <Text title="Quantity" css={{
            placeSelf: "end end",
            paddingInlineEnd: "$sm",
            translate: "0px $space$md",
          }}><Text small color="$accents7">QT</Text> {item.quantity}</Text>
        </Stack>
      </Card.Body>
      <Card.Footer css={{
        flexDirection: "column",
        textAlign: "center",
        gap: "$xs",
        textWrap: "balance",
      }}>
        <Text css={{ lineHeight: "normal" }}>{(info.data && info.data.inventoryDescription.title) ?? "???"}</Text>
        <Text small color="$accents7">{uuid}</Text>
      </Card.Footer>
    </Card>
  );
}

export interface ContainerDisplayProps {
  container: ContainerStructure;
  title?: ReactNode;
  subtitle?: ReactNode;
  expanded?: boolean;
  mods: LocalId[];
  gameMode?: GameMode;
}

export const ContainerDisplay = ({ container, title, subtitle, expanded, mods, gameMode }: ContainerDisplayProps) => {
  return (
    <Collapse
      title={title ?? `Container #${container.id}`}
      subtitle={subtitle}
      expanded={expanded ?? true}
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
  const owners = new Map<number, Player>();
  let players: Player[] = [];
  try {
    players = saveEditor.getAllPlayers();
    for (const player of players) {
      owners.set(player.carryContainerId, player);
      owners.set(player.inventoryContainerId, player);
    }
  } catch (error) {
    console.error("Failed to get player inventories:", error);
  }

  useEffect(() => {
    cacheMissingSummaries(players.map(player => player.steamId64))
      .then(summaries => {
        setPlayerSummaries(new Map(Object.entries(summaries).map(([steamId, summary]) => [BigInt(steamId), summary])));
      });
  }, [saveEditor]);

  const [playerSummaries, setPlayerSummaries] = useState(new Map(players.map(player => [player.steamId64, null as PlayerSummary | null])));

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
          let subtitle: ReactNode;
          let expanded = container.items.findIndex(item => !item.isEmpty()) !== -1;

          const player = owners.get(container.id);
          const summary = player ? playerSummaries.get(player.steamId64) : null;
          
          if (player) {
            if (container.id === player.inventoryContainerId) {
              subtitle = `${summary?.personaName ?? player.steamId64}'s inventory`;
              expanded = true;
            } else if (container.id === player.carryContainerId) {
              subtitle = `${summary?.personaName ?? player.steamId64}'s carry container`;
            }
          }

          return (
            <ContainerDisplay
              key={container.id}
              container={container}
              subtitle={subtitle}
              expanded={expanded}
              mods={mods}
            />
          );
        })}
      </Collapse.Group>
    </>
  );
}

export default Containers;
