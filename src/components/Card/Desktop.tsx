import React from "react";
import { Box } from "../layout/Box/Box";
import { Image } from "./components/Image";
import { Inline } from "../layout/Inline";
import { Stack } from "../layout/Stack";
import { Link } from "gatsby";
import { getMinWidthMediaQuery } from "../../styles";

export const Card: React.FC<Post> = ({
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
        transition: "transform 0.3s ease",
        [`${getMinWidthMediaQuery("minLarge")}`]: {
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
                <span key={category} css={{ color: "#ffffff" }}>
                  {category}
                </span>
              ))}
            </Inline>
          </Box>
        </div>
      </Image>
      <Box padding="small" paddingBottom="large">
        <Stack space="small">
          <h4>{title}</h4>
          <Inline space="xsmall">
            <span>{date}</span>
            <span>{readingTime} min. czytania</span>
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
