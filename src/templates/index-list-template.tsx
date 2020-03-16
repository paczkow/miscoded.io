import React from "react";
import { graphql } from "gatsby";

import { Layout, Inline } from "../components/Layout";
import { Top } from "../components/Layout/Top";
import { Box } from "../components/Layout/Box/Box";
import { Stack } from "../components/Layout/Stack";
import { MobileCard } from "../components/Card/Mobile";
import { mapMarkdownRemarkToPost } from "../utils/mapMarkdownRemarkToPost";
import { Card } from "../components/Card/Desktop";
import { Grid } from "../components/Layout/Grid";
import { Github, Linkedin, Rss, Twitter } from "../components/Icons/Social";

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
      <Top>
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
      </Top>
      <Box
        paddingY={["large", "xlarge"]}
        paddingX={["small", "large"]}
        css={{ display: "flex", justifyContent: "center" }}
      >
        <Grid>
          {allMarkdownRemark.edges.map(({ node }) => {
            const postData = mapMarkdownRemarkToPost(node);

            return (
              <>
                <MobileCard {...postData} />
                <Card {...postData} />
              </>
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
