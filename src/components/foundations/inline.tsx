import React from "react";

import { theme, Space } from "../../theme";
import { Box } from "./box/box";
import { getNegativeMargin, toFlexXAlign } from "./utils/align";

interface InlineProps {
  space?: ResponsiveProp<Space>;
  align?: AlignX;
}

const toNegativeMargin = getNegativeMargin(theme.space);

export const Inline: React.FC<InlineProps> = ({
  children,
  align = "left",
  space = "none",
}) => {
  return (
    <Box marginTop={toNegativeMargin(space)}>
      <Box
        marginLeft={toNegativeMargin(space)}
        justifyContent={toFlexXAlign(align)}
        alignItems="center"
        display="flex"
        flexWrap="wrap"
      >
        {React.Children.map(children, child => (
          <Box paddingTop={space} paddingLeft={space}>
            {child}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
