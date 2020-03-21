import React from "react";
import { WindowLocation } from "@reach/router";
import { graphql, Link } from "gatsby";
import Markdown from "react-markdown";

import { Box, Stack, Inline } from "../components/foundations/layout";
import { getMinWidthMediaQuery } from "../components/foundations/styles";
import { Layout } from "../components/Layout";
import { BackgroundImage } from "../components/BackgroundImage";
import { Dot } from "../components/Dot";
import { Share } from "../components/Share";

interface PostTemplateProps {
  pageContext: PageContext;
  location: WindowLocation;
  data: {
    markdownRemark: MarkdowRemarkNode;
  };
}

const PostTemplate: React.FC<PostTemplateProps> = ({ data, location }) => {
  const {
    frontmatter: { categories, title, date, tags, image, imageCredit },
    fields: { readingTime },
    html,
  } = data.markdownRemark;

  return (
    <Layout>
      <BackgroundImage background={image.childImageSharp}>
        <Box paddingX="small" css={{ position: "relative", zIndex: 10 }}>
          <Stack space="large" align="center">
            <h1 css={{ color: "#ffffff", textAlign: "center" }}>{title}</h1>
            <Inline space="small">
              <span css={{ fontSize: 14, color: "#ffffff" }}>{date}</span>
              <span css={{ fontSize: 14, color: "#ffffff" }}>
                {Math.ceil(readingTime.minutes)} min. czytania
              </span>
            </Inline>
          </Stack>
        </Box>
        <Markdown
          css={{
            zIndex: 10,
            position: "absolute",
            bottom: 8,
            color: "#aeaeae",
            fontSize: 12,
            "& a": {
              color: "#aeaeae",
              "&:hover": {
                color: "#ffffff",
              },
            },
          }}
        >
          {imageCredit}
        </Markdown>
      </BackgroundImage>
      <Box
        paddingY={["large", "large"]}
        paddingX={["small", "large"]}
        css={{ maxWidth: "39rem", margin: "0 auto" }}
        justifyContent="center"
      >
        <Stack space={["medium", "medium", "large"]}>
          <Stack space="small">
            <Inline space="small">
              {categories.map(category => (
                <Link to={`/search?q=${category}&t=category`} key={category}>
                  <span
                    css={{
                      fontSize: 16,
                      color: "#555555",
                      "&:hover": { color: "#000000" },
                    }}
                  >
                    {category}
                  </span>
                </Link>
              ))}
            </Inline>
            <Share location={location} description={title} />
          </Stack>
          <article
            css={{
              "& > *": {
                marginBottom: 16,
              },
              [`${getMinWidthMediaQuery("minMedium")}`]: {
                fontSize: 20,
              },
            }}
            dangerouslySetInnerHTML={{ __html: html ?? "Content not provided" }}
          />
          <Stack space="large">
            <Inline space="small" align="center">
              <Dot /> <Dot /> <Dot />
            </Inline>
            <Stack align="center" space="small">
              <Inline space="small">
                {tags.map(tag => (
                  <Link to={`/search?q=${tag}&t=tag`} key={tag}>
                    <span
                      css={{
                        fontSize: 16,
                        color: "#555555",
                        "&:hover": {
                          color: "#000000",
                        },
                      }}
                    >
                      #{tag}
                    </span>
                  </Link>
                ))}
              </Inline>
              <Stack space="small" align="center">
                <a title="Twitter" href="">
                  <span css={{ fontWeight: 400 }}>Skomentuj (Twitter)</span>
                </a>
                <div css={{ display: "flex", alignItems: "center" }}>
                  <Share location={location} description={title} />
                </div>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
};

export default PostTemplate;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        categories
        date(formatString: "DD, MMMM YYYY", locale: "pl")
        tags
        image {
          childImageSharp {
            fluid {
              src
            }
          }
        }
        imageCredit
      }
      fields {
        slug
        readingTime {
          minutes
        }
      }
    }
  }
`;
