import React from "react";
import { graphql } from "gatsby";
import { FormattedMessage } from "react-intl";

import { Box, Stack, Inline } from "../components/foundations";
import { Layout } from "../components/layout/layout";
import { Posts } from "../components/blog-posts/blog-posts";
import { BackgroundImage } from "../components/background-image";
import { Github, Linkedin, Rss, Twitter } from "../components/icons";
import { mapMarkdownRemarkToPost } from "../utils/map-markdown-remark-to-post";
import SEO from "../components/seo";

interface Props {
  pageContext: PageContext;
  data: {
    allMarkdownRemark: AllMarkdownRemark;
    site: Site;
  };
}

const Index = ({
  pageContext: { locale },
  data: {
    allMarkdownRemark,
    site: {
      siteMetadata: {
        social: { twitter, linkedin, github, rss },
      },
    },
  },
}: Props) => {
  const iconColors = {
    color: "#aeaeae",
    hoverColor: "#ffffff",
  };
  const descriptionFontStyle = {
    letterSpacing: "0.2em",
    fontSize: "1.2rem",
  };
  const posts = allMarkdownRemark.edges.map(({ node }) =>
    mapMarkdownRemarkToPost(node)
  );

  return (
    <Layout>
      <SEO lang={locale} />
      <BackgroundImage>
        <Stack
          space="large"
          align="center"
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 660,
          }}
        >
          <div
            css={{
              position: "relative",
              zIndex: 1000,
              textAlign: "center",
              color: "#ffffff",
              padding: "0 16px",
              ...descriptionFontStyle,
            }}
          >
            <FormattedMessage id="description" />
          </div>
          <div css={{ position: "relative", zIndex: 1000 }}>
            <Inline space="large">
              <a title="Twitter" href={twitter}>
                <Twitter {...iconColors} />
              </a>
              <a title="Linkedin" href={linkedin}>
                <Linkedin {...iconColors} />
              </a>
              <a title="Github" href={github}>
                <Github {...iconColors} />
              </a>
              <a title="Rss" href={rss}>
                <Rss {...iconColors} />
              </a>
            </Inline>
          </div>
        </Stack>
      </BackgroundImage>
      <Box
        paddingY={["large", "xlarge"]}
        paddingX={["small", "large"]}
        css={{ display: "flex", justifyContent: "center" }}
      >
        <Posts data={posts} />
      </Box>
    </Layout>
  );
};

export default Index;

export const query = graphql`
  query($locale: String!, $skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        description
        social {
          twitter
          linkedin
          github
          rss
        }
      }
    }
    allMarkdownRemark(
      filter: { fields: { langKey: { eq: $locale } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(pruneLength: 160)
          frontmatter {
            title
            categories
            description
            date(formatString: "DD, MMMM YYYY", locale: "pl")
            tags
            image {
              childImageSharp {
                fluid {
                  src
                  tracedSVG
                }
              }
            }
          }
          fields {
            slug
            readingTime {
              minutes
            }
          }
        }
      }
    }
  }
`;
