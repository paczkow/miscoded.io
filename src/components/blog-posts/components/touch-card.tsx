import React from "react";
import { Link } from "gatsby";
import { FormattedMessage } from "react-intl";

import { Box, Inline, Stack } from "../../foundations";
import { OverlayImage } from "./image";
import { usePathPrefixContext } from "../../../context/path-prefix-context";

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
  const pathPrefix = usePathPrefixContext();

  return (
    <article>
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
        <header>
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
                    {readingTime} min. <FormattedMessage id="read" />
                  </span>
                </Inline>
              </Stack>
            </Box>
          </OverlayImage>
        </header>
        <Box paddingY="small" paddingBottom="medium" paddingX="small">
          <Stack space="xsmall">
            <Inline space="xsmall">
              {categories.map(category => (
                <Link
                  to={`${pathPrefix}/search?q=${category}&t=category`}
                  key={category}
                >
                  <span css={{ fontSize: 14 }}>{category}</span>
                </Link>
              ))}
            </Inline>
            <p>{excerpt}</p>
            <footer>
              <Link to={slug}>
                <h4
                  css={{
                    fontSize: "18px",
                  }}
                >
                  <FormattedMessage id="read-more" />
                </h4>
              </Link>
            </footer>
          </Stack>
        </Box>
      </Box>
    </article>
  );
};
