import { Button, Col, Container, Row, Table, useAsyncList, useCollator } from "@nextui-org/react";
import { forwardRef, Key, ReactNode, useImperativeHandle, useRef, useState } from "react";
import { cacheMissingSummaries } from "../../caches/player-summary-cache";
import SaveEditor from "../../save-editor";
import Player from "../../structures/player";
import ActionsCell, { Action } from "./Cells/ActionsCell";
import SteamProfileCell from "./Cells/SteamProfileCell";

export interface PlayerDataGridProps {
  saveEditor: SaveEditor;
  players?: Player[];
  buttons?: ReactNode;
}

const PlayerDataGrid = ({ saveEditor, players, buttons }: PlayerDataGridProps) => {
  const collator = useCollator({ numeric: true });
  
  const list = useAsyncList<Player>({
    async load({ }) {
      const playerRows = players ?? saveEditor.getAllPlayers();
      cacheMissingSummaries(playerRows.map(playerRow => playerRow.steamId64));

      return {
        items: playerRows,
      };
    },
    getKey(player) {
      return player.steamId64.toString();
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let first = a[sortDescriptor.column as keyof typeof a];
          let second = b[sortDescriptor.column as keyof typeof a];
          let cmp = collator.compare(`${first}`, `${second}`);
          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  type DeleteButtonHandle = {
    setSelection: (newSelection: "all" | Set<Key>) => void;
  }

  const DeleteButton = forwardRef<DeleteButtonHandle, { children?: ReactNode }>(({ children }, ref) => {
    const [selection, setSelection] = useState<"all" | Set<Key>>(new Set());
    useImperativeHandle(ref, () => ({
      setSelection: (newSelection) => setSelection(newSelection),
    }))

    const disabled = selection === "all"
      ? list.items.length === 0
      : selection.size === 0;

    const deleteSelectedPlayers = () => {
      if (selection === "all") {
        saveEditor.deleteAllPlayers();
        const selectedPlayerKeys = list.items.map(player => player.steamId64.toString());
        list.remove(...selectedPlayerKeys);
      } else {
        const selectedPlayers = Array.from(selection)
          .map(key => list.getItem(key))
          .filter(player => player !== undefined);
        saveEditor.deletePlayers(selectedPlayers);
        list.remove(...selection);
      }
    }

    return (
      <Button color="error" flat disabled={disabled} onClick={deleteSelectedPlayers}>
        {children}
      </Button>
    );
  });
  const deleteButtonRef = useRef<DeleteButtonHandle>(null);

  return (<>
    <Container fluid>
      <Row justify="space-between">
        <Row fluid={false}>
          {buttons}
        </Row>
        <Row fluid={false}>
          <DeleteButton ref={deleteButtonRef}>
            Delete
          </DeleteButton>
        </Row>
      </Row>
    </Container>
    <Table
      aria-label="Player data table"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      selectionMode="multiple"
      onSelectionChange={(keys) => deleteButtonRef.current!.setSelection(keys)}
    >
      <Table.Header>
        <Table.Column key="key" allowsSorting>
          Id
        </Table.Column>
        <Table.Column key="profile">
          Steam Profile
        </Table.Column>
        <Table.Column key="steamId64" allowsSorting>
          SteamId64
        </Table.Column>
        <Table.Column key="worldId" allowsSorting>
          World Id
        </Table.Column>
        <Table.Column key="x" allowsSorting>
          X
        </Table.Column>
        <Table.Column key="y" allowsSorting>
          Y
        </Table.Column>
        <Table.Column key="z" allowsSorting>
          Z
        </Table.Column>
        <Table.Column key="actions" hideHeader align="center">
          Actions
        </Table.Column>
      </Table.Header>
      <Table.Body items={list.items} loadingState={list.loadingState}>
        {(player) => (
          <Table.Row key={player.steamId64.toString()}>
            {(columnKey) => {
              const value = player[columnKey as keyof typeof player];

              switch(columnKey) {
                case "profile":
                  return (
                    <Table.Cell>
                      <SteamProfileCell steamId64={player.steamId64} />
                    </Table.Cell>
                  )
                case "x":
                case "y":
                case "z":
                  return <Table.Cell>{(value as number).toFixed(2)}</Table.Cell>
                case "actions":
                  return (
                    <Table.Cell>
                      <ActionsCell>
                        <Action tooltip="Edit player" onClick={() => console.log("Edit player", player)} icon="edit" />
                        <Action tooltip="Delete player" icon="delete" color="error" onClick={() => {
                          saveEditor.deletePlayers([ player ]) && list.remove(player.steamId64.toString())
                        }}/>
                      </ActionsCell>
                    </Table.Cell>
                  )
              }

              return <Table.Cell>{value?.toString()}</Table.Cell>
            }}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  </>);
}

export default PlayerDataGrid;
