import React from "react";
import { Link } from "gatsby";
import { useInView } from "react-intersection-observer";

import { Box } from "../../foundations/layout/Box/Box";
import { SearchIcon } from "../../icons/Search";
import { getMinWidthMediaQuery } from "../../foundations/styles";

export const Header = () => {
  const [ref, inView, entry] = useInView();
  const isScrolled = entry && !inView;
  const styles = isScrolled
    ? {
        background: "#fefefe",
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
          zIndex: 9999,
          width: "100%",
          position: "fixed",
          top: 0,
          transition: `padding-top ${animationTime}, padding-bottom ${animationTime}, color ${animationTime}, background ${animationTime}, fill ${animationTime}`,
          ...styles,
        }}
      >
        <Link to="/">
          <h1
            css={{
              position: "relative",
              color: inView ? "#ffffff" : "#000000",
            }}
          >
            MISCODED.IO
          </h1>
        </Link>
        <Link
          to="/search"
          css={{
            position: "absolute",
            right: 16,
            [`${getMinWidthMediaQuery("minMedium")}`]: { right: 32 },
          }}
        >
          <SearchIcon color={inView ? "#ffffff" : "#000000"} />
        </Link>
      </Box>
    </header>
  );
};
