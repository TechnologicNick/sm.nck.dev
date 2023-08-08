import { cacheMissingSummaries } from "@/save-editor/caches/player-summary-cache";
import SaveEditor from "@/save-editor/save-editor";
import ContainerStructure from "@/save-editor/structures/container";
import ItemStack, { IItemStack } from "@/save-editor/structures/item-stack";
import Player from "@/save-editor/structures/player";
import { Card, Collapse, Container, CSS, Input, Loading, Row, Spacer, Text } from "@nextui-org/react";
import Stack from "components/Stack";
import Image from "next/image";
import { PlayerSummary } from "pages/api/save-editor/player-summaries";
import { GameMode, LocalId } from "projects/content-database/types";
import { memo, ReactNode, useCallback, useEffect, useState } from "react";
import { trpc } from "utils/trpc";
import { Action } from "../DataGrids/Cells/ActionsCell";
import ItemStackDataModal from "../Modals/ItemStackDataModal";
import Div from "components/Div";

export interface ContainersProps {
  saveEditor: SaveEditor;
  buttons?: ReactNode;
}

export interface ContainerSlotProps {
  item: IItemStack;
  mods: LocalId[];
  gameMode?: GameMode;
  slot: number;
  onUpdate?: (newItemStack: IItemStack, slot: number) => void;
}

export const ContainerSlot = memo(({ item, mods, gameMode, slot, onUpdate }: ContainerSlotProps) => {
  const isEmpty = ItemStack.isEmpty(item);
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
    minHeight: "13.5rem",
  }

  if (isEmpty) {
    return (
      <Card variant="bordered" css={cardCss}>
        <Card.Header css={{
          padding: "$xs",
          paddingBlockEnd: "$1",
          "& > *": {
            justifyContent: "flex-end",
          },
        }}>
          {onUpdate && (
            <Action tooltip="Add item stack" icon="add" modal={
              <ItemStackDataModal
                itemStack={item}
                type="add"
                onUpdate={(newItemStack) => onUpdate(newItemStack, slot)}
              />
            }/>
          )}
        </Card.Header>
      </Card>
    );
  }

  return (
    <Card
      isHoverable={!isEmpty}
      variant="bordered"
      css={cardCss}
    >
      <Card.Header css={{
        padding: "$xs",
        paddingBlockEnd: "$1",
        "& > *": {
          justifyContent: "flex-end",
        },
      }}>
        {onUpdate && (
          <Action tooltip="Edit item stack" icon="edit" modal={
            <ItemStackDataModal
              itemStack={item}
              type="edit"
              onUpdate={(newItemStack) => onUpdate(newItemStack, slot)}
            />
          }/>
        )}
      </Card.Header>
      <Card.Body css={{
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        overflowY: "visible",
        position: "relative",
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
        </Stack>
        <Div css={{
          width: "100%",
          paddingInline: "$sm",
        }}>
          {item.instanceId !== 0xFFFFFFFF && (
            <Text title="Instance ID" css={{
              float: "left",
              lineHeight: "normal",
            }}>{item.instanceId} <Text small color="$accents7">ID</Text></Text>
          )}
          <Text title="Quantity" css={{
            float: "right",
            lineHeight: "normal",
          }}><Text small color="$accents7">QT</Text> {item.quantity}</Text>
        </Div>
      </Card.Body>
      <Card.Footer css={{
        paddingBlockStart: "$1",
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
});

export interface ContainerDisplayProps {
  container: ContainerStructure;
  title?: ReactNode;
  subtitle?: ReactNode;
  expanded?: boolean;
  mods: LocalId[];
  gameMode?: GameMode;
  saveEditor?: SaveEditor;
}

export const ContainerDisplay = ({ container, title, subtitle, expanded, mods, gameMode, saveEditor }: ContainerDisplayProps) => {
  const [lastUpdatedItem, setLastUpdatedItem] = useState<IItemStack | null>(null);

  const setSize = (size: number) => {
    if (!saveEditor) {
      return;
    }

    while (container.items.length < size) {
      container.items.push(new ItemStack({}));
    }

    container.size = size;
    setLastUpdatedItem(container.items[size - 1]);
  }

  const onUpdate = useCallback((newItemStack: IItemStack, slot: number) => {
    container.items[slot] = new ItemStack(newItemStack);
    saveEditor?.updateContainer(container);
    setLastUpdatedItem(container.items[slot]);
  }, [container, saveEditor]);

  return (
    <Collapse
      title={title ?? `Container #${container.id}`}
      subtitle={subtitle}
      expanded={expanded ?? true}
      arrowIcon={saveEditor && (
        <Div>
          <Input
            aria-label={`Size of container #${container.id}`}
            type="number"
            min={0}
            max={0xFFFF}
            step={1}
            bordered
            initialValue={`${container.size}`}
            onClick={(e) => e.stopPropagation()}
            onBlur={(e) => {
              const size = parseInt(e.target.value);
              if (isNaN(size)) {
                return;
              }
              setSize(size);
            }}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              if (isNaN(size) || Math.abs(size - container.size) > 1) {
                return;
              }
              setSize(size);
            }}
          />
        </Div>
      )}
      css={{
        "*:has(> .nextui-expand-content)": {
          height: "unset", // Disable fixed height set by javascript
          display: "grid",
          gridTemplateRows: "0fr",
          transition: "grid-template-rows 200ms ease 0ms, opacity 300ms ease 0ms",
          ".nextui-expand-content": {
            overflow: "hidden",
          }
        },
        "&[data-state='open'] *:has(> .nextui-expand-content)": {
          gridTemplateRows: "1fr",
        },
      }}
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
        {container.items.map((item, slot) => (slot > container.size) ? null : (
          <ContainerSlot
            key={slot}
            item={item}
            mods={mods}
            gameMode={gameMode}
            slot={slot}
            onUpdate={saveEditor && onUpdate}
          />
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
          let expanded = container.items.findIndex(item => ItemStack.isEmpty(item)) !== -1;

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
              saveEditor={saveEditor}
            />
          );
        })}
      </Collapse.Group>
    </>
  );
}

export default Containers;
