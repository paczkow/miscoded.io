import React from "react";
import { WindowLocation } from "@reach/router";
import { graphql, Link } from "gatsby";
import Markdown from "react-markdown";

import { Box, Stack, Inline } from "../components/foundations";
import { getMinWidthMediaQuery } from "../styles";
import { Layout } from "../components/Layout";
import { BackgroundImage } from "../components/BackgroundImage";
import { Dot } from "../components/Dot";
import { Share } from "../components/Share";
import SEO from "../components/SEO";
import { FormattedMessage } from "react-intl";
import { usePathPrefixContext } from "../context/path-prefix-context";

interface PostTemplateProps {
  location: WindowLocation;
  data: {
    markdownRemark: MarkdowRemarkNode;
  };
}

const PostTemplate: React.FC<PostTemplateProps> = ({ data, location }) => {
  const {
    frontmatter: { categories, title, date, tags, image, imageCredit },
    fields: { readingTime, langKey },
    html,
    excerpt,
  } = data.markdownRemark;

  const pathPrefix = usePathPrefixContext();

  return (
    <Layout>
      <SEO
        lang={langKey}
        title={title}
        description={excerpt}
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
          css={{ maxWidth: "39rem", margin: "0 auto" }}
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
                  fontSize: 20,
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
                    <a title="Facebook" href="">
                      <span css={{ fontWeight: 400 }}>
                        <FormattedMessage id="post.comment" /> (Facebook)
                      </span>
                    </a>
                    <div css={{ display: "flex", alignItems: "center" }}>
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

export default PostTemplate;

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
