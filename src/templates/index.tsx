import React from "react";
import { graphql } from "gatsby";
import { FormattedMessage, IntlProvider } from "react-intl";

import { Box, Stack, Inline } from "../components/foundations/layout";
import { Layout } from "../components/Layout";
import { Posts } from "../components/Posts/Posts";
import { BackgroundImage } from "../components/BackgroundImage";
import { Github, Linkedin, Rss, Twitter } from "../components/icons";
import { mapMarkdownRemarkToPost } from "../utils/mapMarkdownRemarkToPost";
import SEO from "../components/SEO";

import Messages from "../../translations/translations.json";

interface Props {
  pageContext: PageContext;
  data: {
    allMarkdownRemark: AllMarkdownRemark;
    site: Site;
  };
}

const Index = ({
  data: {
    allMarkdownRemark,
    site: {
      siteMetadata: {
        description,
        social: { twitter, linkedin, github, rss },
      },
    },
  },
  pageContext: { locale },
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
      <IntlProvider
        locale={locale}
        messages={Messages[locale] as { [key: string]: string }}
      >
        <SEO title={description} />
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
      </IntlProvider>
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
      filter: { frontmatter: { language: { eq: $locale } } }
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
