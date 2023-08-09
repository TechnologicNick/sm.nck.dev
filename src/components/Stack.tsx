import { styled } from "@nextui-org/react";

const Stack = styled("div", {
  display: "grid",
  placeItems: "center",
  placeContent: "center",
  gridTemplateAreas: `"stack"`,
  "& > *, &::before": {
    gridArea: "stack",
  },

  variants: {
    streched: {
      true: {
        justifyContent: "stretch",
        width: "100%",
        "&::before": {
          content: "''",
          display: "block",
          width: "100%",
          height: "$$minHeight",
        },
      },
    },
  },
});

export default Stack;
