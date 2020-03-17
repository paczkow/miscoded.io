import React from "react";

import { getMinWidthMediaQuery } from "../../styles/media-queries";

export const Grid: React.FC = ({ children }) => (
  <div
    css={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(288px, max-content))",
      gridGap: 32,
      justifyContent: "center",
      justifyItems: "center",
      width: "100%",
      [`${getMinWidthMediaQuery("minLarge")}`]: {
        gridGap: 64,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, max-content))",
        maxWidth: 1600,
      },
    }}
  >
    {children}
  </div>
);
