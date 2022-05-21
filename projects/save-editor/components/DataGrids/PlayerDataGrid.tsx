import { Table, useAsyncList, useCollator } from "@nextui-org/react";

import SaveEditor from "../../save-editor";
import Player from "../../structures/player";

export interface PlayerDataGridProps {
  saveEditor: SaveEditor;
  players?: Player[];
}

const PlayerDataGrid = ({ saveEditor, players }: PlayerDataGridProps) => {
  const collator = useCollator({ numeric: true });
  
  const list = useAsyncList<Player>({
    async load({ }) {
      return {
        items: players ?? saveEditor.getAllPlayers(),
      };
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

  return (
    <Table
      aria-label="Player data table"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      selectionMode="multiple"
    >
      <Table.Header>
        <Table.Column key="steamId64" allowsSorting>
          SteamId64
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
      </Table.Header>
      <Table.Body items={list.items} loadingState={list.loadingState}>
        {(item) => (
          <Table.Row key={item.steamId64.toString()}>
            {(columnKey) => {
              const value = item[columnKey as keyof typeof item];
              switch(typeof value) {
                case "number":
                  return <Table.Cell>{value.toFixed(2)}</Table.Cell>
                default:
                  return <Table.Cell>{value.toString()}</Table.Cell>
              }
            }}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}

export default PlayerDataGrid;
