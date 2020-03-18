import React from "react";
import { useStaticQuery, graphql } from "gatsby";

import { Box } from "./foundations/layout/Box/Box";
import { getMinWidthMediaQuery } from "./foundations/styles";

interface BackgroundImageProps {
  background?: {
    fluid: {
      src: string;
    };
  };
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  children,
  background,
}) => {
  const { image } = useStaticQuery(graphql`
    query {
      image: imageSharp(id: { regex: "/b/" }) {
        fluid(
          quality: 100
          traceSVG: { color: "rgb(56, 47, 92)", threshold: 75 }
          toFormat: PNG
        ) {
          tracedSVG
          src
        }
      }
    }
  `);

  return (
    <Box
      css={{
        width: "100%",
        height: 512,
        background: `url("${
          background ? background.fluid.src : image.fluid.src
        }") rgba(0, 0, 0, 1)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [`${getMinWidthMediaQuery("minMedium")}`]: {
          backgroundAttachment: "fixed",
        },
        "&:after": {
          position: "absolute",
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          content: '""',
          background: "rgba(0,0,0,0.6)",
        },
      }}
    >
      {children}
    </Box>
  );
};