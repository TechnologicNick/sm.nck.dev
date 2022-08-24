import { Container } from "@nextui-org/react";

const BluePinkBackground = () => {
  return (
    <Container css={{
      overflow: "hidden",
      pointerEvents: "none",
      "&, *": {
        position: "absolute",
        w: "100vw",
        h: "100vh",
        maxW: "unset",
        maxH: "unset",
        inset: 0,
        p: 0,
        m: 0,
      },
    }}>
      <Container css={{
        background: "radial-gradient(circle at 100% 35%, $blue600 0%, transparent 30%)",
        opacity: 0.2,
        transform: "scaleX(1.5)",
      }}/>
      <Container css={{
        background: "radial-gradient(circle at 30% 80%, $pink500 0%, transparent 20%)",
        opacity: 0.2,
        transform: "scale(3, 1.6)",
      }}/>
    </Container>
  );
}

export default BluePinkBackground;