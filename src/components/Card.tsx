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
    <Box
      css={{
        height: "100%",
        maxWidth: "320px",
        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        css={{
          background: `url("${image}"), url("${tracedSVG}")`,
          height: "216px",
          backgroundSize: "cover",
          position: "relative",
          ":after": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
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
            <h2
              css={{
                fontSize: 24,
                color: "#ffffff",
              }}
            >
              {title}
            </h2>
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
      </div>
      <Box paddingY="small" paddingBottom="medium" paddingX="small">
        <Stack space="xsmall">
          <Inline space="xsmall">
            {categories.map(category => (
              <span key={category} css={{ fontSize: 14 }}>
                {category}
              </span>
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
