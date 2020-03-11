import React from "react";
import { Box } from "./layout/Box/Box";
import { Stack } from "./layout/Stack";
import { Inline } from "./layout/Inline";
import { Link } from "gatsby";
import { Button } from "./Button";

export const MobileCard: React.FC<Post> = ({
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
    <Box paddingBottom="large">
      <div
        css={{
          height: "calc(100vw * 0.75)",
          background: `url("${image}"), url("${tracedSVG}")`,
          backgroundSize: "cover",
          position: "relative",
          backgroundAttachment: "fixed",
        }}
      >
        <Box
          paddingX="small"
          paddingY="medium"
          css={{
            position: "absolute",
            overflow: "hidden",
            bottom: 0,
            width: "100%",
            ":after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              background: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <hr
            css={{
              position: "absolute",
              top: 0,
              margin: 0,
              width: "100%",
              left: 0,
              border: "1px solid rgba(0, 0, 0, 0.075)",
            }}
          />
          <Stack space="xsmall" css={{ position: "relative", zIndex: 1000 }}>
            <Inline space="xsmall">
              {categories.map(category => (
                <Button key={category}>
                  <span css={{ color: "#fff" }}>{category}</span>
                </Button>
              ))}
            </Inline>
            <h1 css={{ fontSize: 24, color: "#fff" }}>{title}</h1>
            <Inline space="xsmall">
              <span css={{ color: "#fff" }}>{date}</span>
              <span css={{ color: "#fff" }}>{readingTime} min czytania</span>
            </Inline>
          </Stack>
        </Box>
      </div>
      <Box paddingX="small" paddingTop="medium">
        <Stack space="small">
          <p>{excerpt}</p>
          <Link to={slug}>Czytaj więcej</Link>
        </Stack>
      </Box>
    </Box>
  );
};
