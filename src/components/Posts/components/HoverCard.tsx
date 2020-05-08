import React from "react";
import { Link } from "gatsby";
import { FormattedMessage } from "react-intl";

import { usePageContext } from "../../../context/Page";
import { Box, Inline, Stack } from "../../foundations/layout/";
import { Image } from "./Image";

export const HoverCard: React.FC<Post> = ({
  title,
  categories,
  date,
  readingTime,
  excerpt,
  slug,
  image,
  tracedSVG,
}) => {
  const { locale } = usePageContext();

  return (
    <article>
      <Box
        css={{
          height: "100%",
          maxWidth: "352px",
          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s ease",
          display: "none",
          "@media(hover: hover)": {
            display: "block",
          },
          "&:hover": {
            transform: "scale(1.1)",
          },
          "&:hover .categories": {
            transform: "translateY(0)",
          },
        }}
      >
        <Image image={image} tracedSVG={tracedSVG}>
          <div
            className="categories"
            css={{
              position: "absolute",
              bottom: 0,
              zIndex: 10,
              width: "100%",
              background: "rgba(0, 0, 0, 0.6)",
              transform: "translateY(100%)",
              transition: "transform 0.3s ease",
            }}
          >
            <Box padding="small">
              <Inline space="small">
                {categories.map(category => (
                  <Link
                    to={`/${locale}/search?q=${category}&t=category`}
                    key={category}
                  >
                    <span
                      css={{
                        fontSize: 14,
                        color: "#e7e7e7",
                        "&:hover": { color: "#ffffff" },
                      }}
                    >
                      {category}
                    </span>
                  </Link>
                ))}
              </Inline>
            </Box>
          </div>
        </Image>
        <Box padding="small" paddingBottom="large">
          <Stack space="xsmall">
            <header>
              <Link to={slug}>
                <h4
                  css={{
                    display: "inline",
                    "&:hover": {
                      color: "#000000",
                    },
                  }}
                >
                  {title}
                </h4>
              </Link>
              <Inline space="xsmall">
                <span css={{ fontSize: 14 }}>{date}</span>
                <span css={{ fontSize: 14 }}>
                  {readingTime} min. <FormattedMessage id="read" />
                </span>
              </Inline>
            </header>
            <p>{excerpt}</p>
            <footer>
              <Link to={slug}>
                <h4
                  css={{
                    fontSize: "18px",
                    display: "inline",
                    "&:hover": {
                      color: "#000000",
                    },
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
