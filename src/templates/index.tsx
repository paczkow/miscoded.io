import React from "react";
import { graphql } from "gatsby";

import { Box, Stack, Inline } from "../components/foundations/layout";
import { Layout } from "../components/Layout";
import { Posts } from "../components/Posts/Posts";
import { BackgroundImage } from "../components/BackgroundImage";
import { Github, Linkedin, Rss, Twitter } from "../components/icons";
import { mapMarkdownRemarkToPost } from "../utils/mapMarkdownRemarkToPost";

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
    fontFamily: "Source Code Pro",
    fontWeight: 300,
  };
  const posts = allMarkdownRemark.edges.map(({ node }) =>
    mapMarkdownRemarkToPost(node)
  );

  return (
    <Layout>
      <BackgroundImage>
        <Stack
          space="large"
          align="center"
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 550,
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
            WITAM CIĘ W MIEJSCU W KTÓRYM WERYFIKUJĘ SWOJĄ WIEDZĘ DZIELĄC SIĘ NIĄ
            Z TOBĄ
          </div>
          <div
            css={{
              position: "relative",
              zIndex: 1000,
              color: "#ffffff",
              ...descriptionFontStyle,
            }}
          >
            MICHAŁ PACZKÓW
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
  query($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        social {
          twitter
          linkedin
          github
          rss
        }
      }
    }
    allMarkdownRemark(
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
