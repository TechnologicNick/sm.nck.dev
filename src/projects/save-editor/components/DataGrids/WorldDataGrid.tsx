import { Button, Container, Row, Spacer, Table, useAsyncList, useCollator } from "@nextui-org/react";
import { forwardRef, Key, ReactNode, useImperativeHandle, useRef, useState } from "react";
import SaveEditor from "@/save-editor/save-editor";
import ActionsCell, { Action } from "./Cells/ActionsCell";
import World, { IWorld } from "@/save-editor/structures/world";
import Uuid from "@/save-editor/structures/uuid";
import { ModalProps } from "../Modals";
import WorldDataModal from "../Modals/WorldDataModal";

export interface WorldDataGridProps {
  saveEditor: SaveEditor;
  worlds?: IWorld[];
  buttons?: ReactNode;
}

type Identifyable<T> = T & {
  identifier: Key;
}

const addIdentifier = <T,>(content: T): Identifyable<T> => {
  return {
    ...content,
    identifier: Uuid.randomUuid().toString(),
  };
}

const getKey = (identifyable: Identifyable<any>) => identifyable.identifier;

interface DeleteButtonHandle {
  setSelection: (newSelection: "all" | Set<Key>) => void;
}

interface ButtonProps {
  saveEditor: SaveEditor;
  list: ReturnType<typeof useAsyncList<Identifyable<IWorld>>>;
  children?: ReactNode;
}

const DeleteButton = forwardRef<DeleteButtonHandle, ButtonProps>(({
  saveEditor,
  list,
  children,
}, ref) => {
  const [selection, setSelection] = useState<"all" | Set<Key>>(new Set());
  useImperativeHandle(ref, () => ({
    setSelection: (newSelection) => setSelection(newSelection),
  }))

  const disabled = selection === "all"
    ? list.items.length === 0
    : selection.size === 0;

  const deleteSelectedWorlds = () => {
    if (selection === "all") {
      saveEditor.deleteAllWorlds();
      const selectedWorlds = list.items.map(getKey);
      list.remove(...selectedWorlds);
    } else {
      const selectedWorlds = Array.from(selection)
        .map(key => list.getItem(key))
        .filter(world => world !== undefined);
      saveEditor.deleteWorlds(selectedWorlds);
      list.remove(...selection);
    }
  }

  return (
    <Button color="error" disabled={disabled} onClick={deleteSelectedWorlds}>
      {children}
    </Button>
  );
});

// const AddButton = ({ saveEditor, list, children }: ButtonProps) => {
//   const modalRef: ModalProps["modalRef"] = useRef<any>();
//   const [modalKey, setModalKey] = useState(Math.random());

//   const addUgcItem = (newUgcItem: IUserGeneratedContent) => {
//     saveEditor.setUserGeneratedContent([...list.items, newUgcItem]);
//     list.append(addIdentifier(newUgcItem));
//   }

//   return (
//     <>
//       <UgcDataModal
//         key={modalKey}
//         onUpdate={addUgcItem}
//         modalRef={modalRef}
//         type="add"
//         onUnmount={() => setModalKey(Math.random())} // Reset the form when the modal is closed
//       />
//       <Button color="primary" onClick={() => modalRef.current.setVisible(true)}>
//         {children}
//       </Button>
//     </>
//   );
// }

const WorldDataGrid = ({ saveEditor, worlds, buttons }: WorldDataGridProps) => {
  const collator = useCollator({ numeric: true });
  const deleteButtonRef = useRef<DeleteButtonHandle>(null);

  const list = useAsyncList<Identifyable<IWorld>>({
    async load({ }) {
      const worldRows = worlds ?? saveEditor.getWorlds();

      return {
        items: worldRows.map(addIdentifier),
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
    console.error("Failed loading worlds:");
    console.error(list.error);
  }

  return (<>
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
          {/* <AddButton saveEditor={saveEditor} list={list}>
            Add
          </AddButton>
          <Spacer x={1} /> */}
          <DeleteButton ref={deleteButtonRef} saveEditor={saveEditor} list={list}>
            Delete
          </DeleteButton>
        </Row>
      </Row>
    </Container>
    <Table
      aria-label="Worlds data table"
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      selectionMode="multiple"
      onSelectionChange={(keys) => deleteButtonRef.current!.setSelection(keys)}
    >
      <Table.Header>
        <Table.Column key="worldId">
          World Id
        </Table.Column>
        <Table.Column key="filename">
          Script Filename
        </Table.Column>
        <Table.Column key="classname">
          Script Classname
        </Table.Column>
        <Table.Column key="seed">
          Seed
        </Table.Column>
        <Table.Column key="terrainParams">
          Script Data
        </Table.Column>
        <Table.Column key="actions" hideHeader align="center">
          Actions
        </Table.Column>
      </Table.Header>
      <Table.Body items={list.items} loadingState={list.loadingState}>
        {(world) => (
          <Table.Row key={getKey(world)}>
            {(columnKey) => {
              const value = world[columnKey as keyof typeof world];

              switch(columnKey) {
                case "worldId":
                case "filename":
                case "classname":
                case "seed":
                case "terrainParams":
                  return <Table.Cell>{`${value}`}</Table.Cell>
                case "actions":
                  return (
                    <Table.Cell>
                      <ActionsCell>
                        <Action tooltip="Edit world" icon="edit" modal={
                          <WorldDataModal
                            world={world}
                            onUpdate={(newWorld) => {
                              const newIdentifyableWorld: Identifyable<IWorld> = {
                                identifier: world.identifier,
                                ...newWorld,
                              }
                              saveEditor.updateWorld(world, new World(newWorld));
                              list.update(world.identifier, newIdentifyableWorld);
                            }}
                            type="edit"
                          />
                        }/>
                        <Action tooltip="Delete world" icon="delete" color="error" onClick={() => {
                          saveEditor.deleteWorlds([world]) && list.remove(getKey(world));
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

export default WorldDataGrid;
