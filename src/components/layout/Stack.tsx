import React from "react";

import { Box } from "./Box/Box";
import { Space } from "../../theme";
import { toFlexXAlign } from "./utils/align";

interface StackProps {
  space?: ResponsiveProp<Space>;
  align?: AlignX;
}

export const Stack: React.FC<StackProps> = ({
  children,
  align = "left",
  space = "none",
}) => {
  const containerStyles =
    align === "left"
      ? ({
          display: "block",
        } as const)
      : ({
          display: "flex",
          flexDirection: "column",
          alignItems: toFlexXAlign(align),
        } as const);

  return (
    <Box
      {...containerStyles}
      css={{
        "> div:last-child": {
          paddingBottom: 0,
        },
      }}
    >
      {React.Children.map(children, child => (
        <Box paddingBottom={space}>{child}</Box>
      ))}
    </Box>
  );
};
