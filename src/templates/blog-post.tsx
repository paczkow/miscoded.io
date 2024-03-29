import React from "react";
import { WindowLocation } from "@reach/router";
import { graphql, Link } from "gatsby";
import Markdown from "react-markdown";

import { Box, Stack, Inline } from "../components/foundations";
import { getMinWidthMediaQuery } from "../styles";
import { Layout } from "../components/layout/layout";
import { BackgroundImage } from "../components/background-image";
import { Dot } from "../components/dot";
import { Share } from "../components/share";
import SEO from "../components/seo";
import { FormattedMessage } from "react-intl";
import { usePathPrefixContext } from "../context/path-prefix-context";

interface BlogPostProps {
  location: WindowLocation;
  data: {
    markdownRemark: MarkdowRemarkNode;
  };
}

const BlogPost: React.FC<BlogPostProps> = ({ data, location }) => {
  const {
    frontmatter: { categories, title, date, tags, image, imageCredit },
    fields: { readingTime, langKey, slug },
    html,
    excerpt,
  } = data.markdownRemark;

  const pathPrefix = usePathPrefixContext();

  const disqusConfig = {
    shortname: process.env.GATSBY_DISQUS_NAME!,
    config: {
      url: `https://miscoded.io/${slug}`,
      identifier: slug,
      title,
    },
  };

  return (
    <Layout>
      <SEO
        lang={langKey}
        title={title}
        description="miscoded.io"
        image={{
          src: image.childImageSharp.fluid.src,
          height: "800",
          width: "1200",
        }}
        pathname={location.pathname}
      />
      <article>
        <header>
          <BackgroundImage background={image.childImageSharp}>
            <Box paddingX="small" css={{ position: "relative", zIndex: 10 }}>
              <Stack space="large" align="center">
                <h1 css={{ color: "#ffffff", textAlign: "center" }}>{title}</h1>
                <Inline space="small">
                  <span css={{ fontSize: 14, color: "#ffffff" }}>{date}</span>
                  <span css={{ fontSize: 14, color: "#ffffff" }}>
                    {Math.ceil(readingTime.minutes)} min.{" "}
                    <FormattedMessage id="read" />
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
        </header>
        <Box
          paddingY={["large", "large"]}
          paddingX={["small", "large"]}
          css={{ maxWidth: "48rem", margin: "0 auto" }}
          justifyContent="center"
        >
          <Stack space={["medium", "medium", "large"]}>
            <Stack space="small">
              <Inline space="small">
                {categories.map(category => (
                  <Link
                    to={`${pathPrefix}/search?q=${category}&t=category`}
                    key={category}
                  >
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
            <div
              css={{
                "& > *": {
                  marginBottom: 16,
                },
                [`${getMinWidthMediaQuery("minMedium")}`]: {
                  fontSize: 18,
                },
              }}
              dangerouslySetInnerHTML={{
                __html: html ?? "Content not provided",
              }}
            />
            <Stack space="large">
              <Inline space="small" align="center">
                <Dot /> <Dot /> <Dot />
              </Inline>
              <footer>
                <Stack align="center" space="small">
                  <Inline space="small">
                    {tags.map(tag => (
                      <Link
                        to={`${pathPrefix}/search?q=${tag}&t=tag`}
                        key={tag}
                      >
                        <button
                          style={{
                            background: "#efefef",
                            padding: 8,
                            border: "1px solid #e7e7e7",
                            borderRadius: 2,
                          }}
                        >
                          <span
                            css={{
                              fontSize: 16,
                              color: "#555555",
                              "&:hover": {
                                color: "#000000",
                              },
                            }}
                          >
                            {tag}
                          </span>
                        </button>
                      </Link>
                    ))}
                  </Inline>
                  <Stack
                    space="small"
                    align="center"
                    css={{ marginBottom: "16px" }}
                  >
                    <div
                      css={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Share location={location} description={title} />
                    </div>
                  </Stack>
                </Stack>
              </footer>
            </Stack>
          </Stack>
        </Box>
      </article>
    </Layout>
  );
};

export default BlogPost;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt(pruneLength: 160)
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
        langKey
        readingTime {
          minutes
        }
      }
    }
  }
`;
