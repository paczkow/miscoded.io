import React from "react";
import { Link } from "gatsby";
import { useInView } from "react-intersection-observer";
import { usePathPrefixContext } from "../../../context/path-prefix-context";

import { Box } from "../../foundations/box/box";
import { getMinWidthMediaQuery } from "../../../styles";
import { Search, Logo } from "../../icons";
import { BlackGradientLogo } from "../../icons/black-gradient-logo";

export const Header = () => {
  const [ref, inView, entry] = useInView();
  const pathPrefix = usePathPrefixContext();
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
      <nav>
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
          <Link to={pathPrefix} css={{ marginLeft: "auto" }}>
            <div css={{ display: "flex", alignItems: "center" }}>
              {inView ? (
                <Logo
                  width="48"
                  height="56"
                  color="#ffffff"
                  css={{
                    [`${getMinWidthMediaQuery("minMedium")}`]: {
                      width: "52px",
                      height: "64px",
                      paddingTop: "4px",
                    },
                  }}
                />
              ) : (
                <BlackGradientLogo
                  width="48"
                  height="56"
                  css={{
                    [`${getMinWidthMediaQuery("minMedium")}`]: {
                      width: "52px",
                      height: "64px",
                      paddingTop: "4px",
                    },
                  }}
                />
              )}
              <h1
                css={{
                  position: "relative",
                  color: inView ? "#ffffff" : "#000000",
                  marginLeft: "8px",
                  letterSpacing: "0.1em",
                  fontSize: "24px",
                  [`${getMinWidthMediaQuery("minMedium")}`]: {
                    fontSize: "28px",
                  },
                }}
              >
                MISCODED.IO
              </h1>
            </div>
          </Link>

          <Link
            to={`${pathPrefix}/search`}
            css={{
              marginLeft: "auto",
              marginTop: "8px",
              [`${getMinWidthMediaQuery("minMedium")}`]: {
                right: "32px",
                marginTop: 0,
              },
            }}
          >
            <Search
              width="18"
              height="18"
              color={inView ? "#ffffff" : "#000000"}
            />
          </Link>
        </Box>
      </nav>
    </header>
  );
};
