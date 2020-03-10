import React from "react";
import { useInView } from "react-intersection-observer";

import { Box } from "./Box/Box";
import { SearchIcon } from "../icons/search";

export const Header = () => {
  const [ref, inView, entry] = useInView();
  const isScrolled = entry && !inView;
  const styles = isScrolled
    ? {
        background: "rgba(255, 255, 255, 1)",
        color: "black",
        fill: "black",
      }
    : {
        background: "transparent",
        color: "white",
        fill: "white",
      };
  const animationTime = "0.3s ease";

  return (
    <header ref={ref}>
      <Box
        paddingX={["small", "large"]}
        paddingY={isScrolled ? "xsmall" : "small"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        css={{
          zIndex: 10,
          width: "100%",
          position: "fixed",
          top: 0,
          transition: `padding-top ${animationTime}, padding-bottom ${animationTime}, color ${animationTime}, background ${animationTime}, fill ${animationTime}`,
          ...styles,
        }}
      >
        <h1 css={{ marginLeft: "auto" }}>MISCODED.IO</h1>
        <SearchIcon css={{ marginLeft: "auto" }} />
      </Box>
    </header>
  );
};
