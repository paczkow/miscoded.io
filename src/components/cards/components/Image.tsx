import React from "react";

import { getMaxWidthMediaQuery } from "../../foundations/styles";

interface ImageProps {
  image: string;
  tracedSVG: string;
}

export const Image: React.FC<ImageProps> = ({ image, tracedSVG, children }) => (
  <div
    css={{
      background: `url("${image}"), url("${tracedSVG}")`,
      height: "216px",
      backgroundSize: "cover",
      position: "relative",
      overflow: "hidden",
      [`${getMaxWidthMediaQuery("minLarge")}`]: {
        ":after": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          background: "rgba(0, 0, 0, 0.5)",
        },
      },
    }}
  >
    {children}
  </div>
);
