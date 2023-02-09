import SaveEditor from "@/save-editor/save-editor";
import { Container, Row, Spacer, Text } from "@nextui-org/react";
import { ReactNode } from "react";

export interface ContainersProps {
  saveEditor: SaveEditor;
  buttons?: ReactNode;
}

const Containers = ({ saveEditor, buttons }: ContainersProps) => {
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
    </>
  );
}

export default Containers;
