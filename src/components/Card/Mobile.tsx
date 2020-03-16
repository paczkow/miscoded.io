import React from "react";
import { Box } from "../Layout/Box/Box";
import { Stack } from "../Layout/Stack";
import { Inline } from "../Layout/Inline";
import { Link } from "gatsby";
import { Image } from "./components/Image";
import { getMinWidthMediaQuery } from "../../styles";

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
        [`${getMinWidthMediaQuery("minLarge")}`]: {
          display: "none",
        },
      }}
    >
      <Image image={image} tracedSVG={tracedSVG}>
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
            <Link to="slug">
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
      </Image>
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
