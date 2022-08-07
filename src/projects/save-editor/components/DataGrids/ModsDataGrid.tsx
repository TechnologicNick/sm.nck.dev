import { Button, Container, Row, Table, useAsyncList, useCollator } from "@nextui-org/react";
import { forwardRef, Key, ReactNode, useImperativeHandle, useRef, useState } from "react";
import SaveEditor from "@/save-editor/save-editor";
import PlayerDataModal from "@/save-editor/components/Modals/PlayerDataModal";
import ActionsCell, { Action } from "./Cells/ActionsCell";
import SteamProfileCell from "./Cells/SteamProfileCell";
import { IUserGeneratedContent } from "@/save-editor/structures/user-generated-content";

export interface ModsDataGridProps {
  saveEditor: SaveEditor;
  userGeneratedContent?: IUserGeneratedContent[];
  buttons?: ReactNode;
}

const PlayerDataGrid = ({ saveEditor, userGeneratedContent, buttons }: ModsDataGridProps) => {
  const collator = useCollator({ numeric: true });

  const getKey = (ugcItem: IUserGeneratedContent) => `${ugcItem.fileId}_${ugcItem.localId}`;

  const list = useAsyncList<IUserGeneratedContent>({
    async load({ }) {
      return {
        items: userGeneratedContent ?? saveEditor.getUserGeneratedContent(),
      };
    },
    getKey,
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

  if (list.error) {
    // TODO: Show an error to the user
    console.error("Failed loading user generated content:");
    console.error(list.error);
  }

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

    const deleteSelectedUgcItems = () => {
      if (selection === "all") {
        saveEditor.setUserGeneratedContent([]);
        console.log("Deleted all user generated content");
        console.log(saveEditor.getUserGeneratedContent());
        const selectedUgcItemKeys = list.items.map(getKey);
        list.remove(...selectedUgcItemKeys);
      } else {
        const selectedUgcItemKeys = Array.from(selection);
        const nonSelectedUgcItems = list.items
          .filter(ugcItem => !selectedUgcItemKeys.includes(getKey(ugcItem)));
        saveEditor.setUserGeneratedContent(nonSelectedUgcItems);
        list.remove(...selection);
      }
    }

    return (
      <Button color="error" disabled={disabled} onClick={deleteSelectedUgcItems}>
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
      aria-label="Mods data table"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      selectionMode="multiple"
      onSelectionChange={(keys) => deleteButtonRef.current!.setSelection(keys)}
    >
      <Table.Header>
        <Table.Column key="details">
          Steam Details
        </Table.Column>
        <Table.Column key="fileId" allowsSorting>
          File Id
        </Table.Column>
        <Table.Column key="localId" allowsSorting>
          Local Id
        </Table.Column>
        <Table.Column key="actions" hideHeader align="center">
          Actions
        </Table.Column>
      </Table.Header>
      <Table.Body items={list.items} loadingState={list.loadingState}>
        {(ugcItem) => (
          <Table.Row key={getKey(ugcItem)}>
            {(columnKey) => {
              const value = ugcItem[columnKey as keyof typeof ugcItem];

              switch(columnKey) {
                case "details":
                  return (
                    <Table.Cell>
                      {/* <SteamProfileCell steamId64={ugcItem.steamId64} /> */}
                      Details
                    </Table.Cell>
                  )
                case "fileId":
                case "localId":
                  return <Table.Cell>{`${value}`}</Table.Cell>
                case "actions":
                  return (
                    <Table.Cell>
                      <ActionsCell>
                        <Action tooltip="Edit mod" icon="edit" onClick={() => {
                          console.log("Edit", ugcItem);
                        }}/>
                        <Action tooltip="Delete mod" icon="delete" color="error" onClick={() => {
                          const otherUgcItems = list.items
                            .filter(item => getKey(item) !== getKey(ugcItem));
                          saveEditor.setUserGeneratedContent(otherUgcItems);
                          list.remove(getKey(ugcItem));
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