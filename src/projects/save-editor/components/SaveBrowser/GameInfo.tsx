import { useNoInitialEffect } from "@/save-editor/hooks";
import SaveEditor from "@/save-editor/save-editor";
import { Container, Input, Row, Spacer, Table, Text, useInput } from "@nextui-org/react";
import { ReactNode, useId, useMemo, useRef, useState } from "react";

export interface NumberFieldProps {
  ariaLabelledby: string;
  initialValue: number;
  onChange: (value: number) => void;
}

const NumberField = ({ ariaLabelledby, initialValue, onChange }: NumberFieldProps) => {
  const initialValueRef = useRef(initialValue);
  const { value, bindings } = useInput(`${initialValueRef.current}`);

  const min = 0;
  const max = 0xFFFFFFFF;

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
    onChange(helper.valid ?? initialValueRef.current);
  }, [helper.valid]);

  return (
    <Input
      {...bindings}
      clearable
      placeholder={`${initialValueRef.current}`}
      helperColor={"error"}
      helperText={helper.error ?? ""}
      aria-labelledby={ariaLabelledby}
      onMouseDown={(e) => e.stopPropagation()}
    />
  );
}

export interface GameInfoProps {
  saveEditor: SaveEditor;
  buttons?: ReactNode;
}

const GameInfo = ({ saveEditor, buttons }: GameInfoProps) => {

  const versionId = useId();
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
