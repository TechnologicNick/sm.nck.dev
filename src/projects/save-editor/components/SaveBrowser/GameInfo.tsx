import { useNoInitialEffect } from "@/save-editor/hooks";
import SaveEditor from "@/save-editor/save-editor";
import GameMode, { GameModeDescriptions } from "@/save-editor/types/game-mode";
import { Container, Dropdown, Input, Row, Spacer, Table, Text, useInput } from "@nextui-org/react";
import { ReactNode, useId, useMemo, useRef, useState } from "react";

export interface NumberFieldProps {
  ariaLabelledby?: string;
  ariaLabel?: string;
  initialValue: number;
  onChange?: (value: number) => void;
  onBlur?: (value: number) => void;
  min?: number;
  max?: number;
}

const NumberField = ({ ariaLabelledby, ariaLabel, initialValue, onChange, onBlur, min: propMin, max: propMax }: NumberFieldProps) => {
  const initialValueRef = useRef(initialValue);
  const { value, bindings } = useInput(`${initialValueRef.current}`);

  const min = propMin ?? 0;
  const max = propMax ?? 0xFFFFFFFF;

  const helper = useMemo(() => {
    try {
      const parsedValue = parseInt(value);
      if (isNaN(parsedValue)) {
        return {
          error: "Invalid number",
        }
      } else if (min !== undefined && parsedValue < min) {
        return {
          error: `Lower than ${min}`,
        }
      } else if (max !== undefined && parsedValue > max) {
        return {
          error: `Higher than ${max}`,
        }
      } else {
        return {
          valid: parsedValue,
        }
      }
    } catch (error) {
      return {
        error: "Invalid integer",
      }
    }
  }, [value]);

  useNoInitialEffect(() => {
    onChange?.(helper.valid ?? initialValueRef.current);
  }, [helper.valid]);

  return (
    <Input
      {...bindings}
      clearable
      placeholder={`${initialValueRef.current}`}
      helperColor={"error"}
      helperText={helper.error ?? ""}
      aria-labelledby={ariaLabelledby}
      aria-label={ariaLabel}
      onMouseDown={(e) => e.stopPropagation()}
      onBlur={() => onBlur?.(helper.valid ?? initialValueRef.current)}
    />
  );
}

export interface GameInfoProps {
  saveEditor: SaveEditor;
  buttons?: ReactNode;
}

const GameInfo = ({ saveEditor, buttons }: GameInfoProps) => {
  const versionId = useId();
  const gameModeId = useId();
  const seedId = useId();
  const gametickId = useId();

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
          Game information
        </Text>
      </Container>
      <Table
        aria-label="Table with information about the save file"
        css={{
          ".nextui-table-cell": {
            overflow: "visible",
          },
        }}
      >
        <Table.Header>
          <Table.Column>Property</Table.Column>
          <Table.Column>Value</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Text as={"label"} id={versionId}>Save game version</Text>
            </Table.Cell>
            <Table.Cell>
              <Input
                readOnly
                initialValue={`${saveEditor.getVersion()}`}
                aria-labelledby={versionId}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Text as={"label"} id={gameModeId}>Game mode</Text>
            </Table.Cell>
            <Table.Cell>
              {(() => {
                const [gameMode, setGameMode] = useState(saveEditor.getGameMode());

                return (
                  <Row align="center">
                    <Dropdown>
                      <Dropdown.Button flat color="secondary">
                        {GameMode[gameMode]?.replaceAll("_", " ") ?? "Unlisted"}
                      </Dropdown.Button>
                      <Dropdown.Menu
                        color="secondary"
                        aria-label="Select game mode"
                        css={{ $$dropdownMenuWidth: "420px" }}
                        onAction={(action) => {
                          setGameMode(action as GameMode);
                          saveEditor.setGameMode(action as GameMode);
                        }}
                      >
                        <Dropdown.Section title="Valid game modes">
                          {Object.keys(GameMode).filter(gameMode => isNaN(parseInt(gameMode))).map((gameMode) => (
                            <Dropdown.Item
                              key={GameMode[gameMode as keyof typeof GameMode]}
                              command={`${GameMode[gameMode as keyof typeof GameMode]}`}
                              description={GameModeDescriptions[gameMode as keyof typeof GameMode]}
                              
                            >
                              {gameMode.replaceAll("_", " ")}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Section>
                        <Dropdown.Section>
                          <Dropdown.Item
                            key={9}
                            color="error"
                            command="other"
                            description="Invalid game mode"
                          >
                            Unlisted
                          </Dropdown.Item>
                        </Dropdown.Section>
                      </Dropdown.Menu>
                    </Dropdown>
                    {!GameMode[gameMode] && (
                      <>
                        <Spacer x={1} />
                        <NumberField
                          ariaLabel="Unlisted game mode id"
                          initialValue={gameMode}
                          onBlur={(newGameMode) => {
                            setGameMode(newGameMode);
                            saveEditor.setGameMode(newGameMode);
                          }}
                          min={0}
                          max={0xFF}
                        />
                      </>
                    )}
                  </Row>
                );
              })()}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Text as={"label"} id={seedId}>Seed</Text>
            </Table.Cell>
            <Table.Cell>
              <NumberField
                ariaLabelledby={seedId}
                initialValue={saveEditor.getSeed()}
                onChange={(seed) => saveEditor.setSeed(seed)}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>
              <Text as={"label"} id={gametickId}>Game tick</Text>
            </Table.Cell>
            <Table.Cell>
              {(() => {
                const [gametick, setGametick] = useState(saveEditor.getGametick());
                const totalSeconds = Math.floor(gametick / 40);

                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                return (
                  <Row align="center">
                    <NumberField
                      ariaLabelledby={gametickId}
                      initialValue={saveEditor.getGametick()}
                      onChange={(newGametick) => {
                        saveEditor.setGametick(newGametick);
                        setGametick(newGametick);
                      }}
                    />
                    <Spacer x={1} />
                    <Text css={{ minWidth: "100px" }}>
                      {hours}
                      <Text span small>h </Text>
                      {`${minutes}`.padStart(2, "0")}
                      <Text span small>m </Text>
                      {`${seconds}`.padStart(2, "0")}
                      <Text span small>s</Text>
                    </Text>
                  </Row>
                );
              })()}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
}

export default GameInfo;
