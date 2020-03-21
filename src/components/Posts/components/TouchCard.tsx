import React from "react";
import { Link } from "gatsby";

import { Box, Inline, Stack } from "../../foundations/layout";
import { OverlayImage } from "./Image";

export const TouchCard: React.FC<Post> = ({
  title,
  categories,
  date,
  readingTime,
  excerpt,
  slug,
  image,
  tracedSVG,
}) => {
  return (
    <Box
      css={{
        height: "100%",
        maxWidth: "352px",
        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.2)",
        display: "none",
        "@media(hover: none)": {
          display: "block",
        },
      }}
    >
      <OverlayImage image={image} tracedSVG={tracedSVG}>
        <Box
          paddingX="small"
          paddingBottom="medium"
          css={{
            position: "absolute",
            zIndex: 10,
            bottom: 0,
          }}
        >
          <Stack space="xsmall">
            <Link to={slug}>
              <h2
                css={{
                  fontSize: 24,
                  color: "#ffffff",
                }}
              >
                {title}
              </h2>
            </Link>
            <Inline space="small">
              <span
                css={{
                  fontSize: 12,
                  color: "#ffffff",
                }}
              >
                {date}
              </span>
              <span
                css={{
                  fontSize: 12,
                  color: "#ffffff",
                }}
              >
                {readingTime} min. czytania
              </span>
            </Inline>
          </Stack>
        </Box>
      </OverlayImage>
      <Box paddingY="small" paddingBottom="medium" paddingX="small">
        <Stack space="xsmall">
          <Inline space="xsmall">
            {categories.map(category => (
              <Link to={`/search?q=${category}&t=category`} key={category}>
                <span css={{ fontSize: 14 }}>{category}</span>
              </Link>
            ))}
          </Inline>
          <p>{excerpt}</p>
          <Link to={slug}>
            <h4
              css={{
                fontSize: "18px",
              }}
            >
              Czytaj więcej
            </h4>
          </Link>
        </Stack>
      </Box>
    </Box>
  );
};
