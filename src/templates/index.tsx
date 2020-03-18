import React from "react";
import { graphql } from "gatsby";

import { Box, Stack, Inline } from "../components/foundations/layout";
import { Layout } from "../components/Layout";
import { BackgroundImage } from "../components/BackgroundImage";
import { Card } from "../components/cards/Desktop";
import { MobileCard } from "../components/cards/Mobile";
import { Grid } from "../components/Grid";
import { Github, Linkedin, Rss, Twitter } from "../components/icons";
import { mapMarkdownRemarkToPost } from "../utils/mapMarkdownRemarkToPost";

interface Props {
  pageContext: PageContext;
  data: AllMarkdownRemark;
}

const Index = ({ data }: Props) => {
  const { allMarkdownRemark } = data;
  const iconColors = {
    color: "#aeaeae",
    hoverColor: "#ffffff",
  };
  const descriptionFontStyle = {
    fontFamily: "Source Code Pro",
    fontWeight: 300,
  };
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
              <a title="Twitter" href="/twitter">
                <Twitter {...iconColors} />
              </a>

              <a title="Github" href="/github">
                <Github {...iconColors} />
              </a>
              <a title="Linkedin" href="/linkedin">
                <Linkedin {...iconColors} />
              </a>
              <a title="Rss" href="/rss">
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
        <Grid>
          {allMarkdownRemark.edges.map(({ node }) => {
            const post = mapMarkdownRemarkToPost(node);

            return (
              <article key={post.slug}>
                <MobileCard {...post} />
                <Card {...post} />
              </article>
            );
          })}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Index;

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
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
