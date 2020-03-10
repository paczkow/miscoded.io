import React from "react";
import { graphql } from "gatsby";

import { Layout } from "../components/layout";
import { Top } from "../components/layout/Top";
import { Box } from "../components/layout/Box/Box";
import { getMinWidthMediaQuery } from "../styles/media-queries";
import { Stack } from "../components/layout/Stack";

interface Props {
  pageContext: PageContext;
  data: AllMarkdownRemark;
}

const Index = () => {
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
            }}
          >
            WITAM CIĘ W MIEJSCU W KTÓRYM WERYFIKUJĘ WIEDZĘ SWOJA DZIELĄC SIĘ NIĄ Z TOBĄ
          </div>
          <div css={{ position: "relative", zIndex: 1000, color: "#ffffff" }}>
            MICHAŁ PACZKÓW
          </div>
        </Stack>
      </Top>
      <Box
        paddingY={["none", "xlarge"]}
        paddingX={["none", "large"]}
        css={{ margin: "0 auto", maxWidth: 1600 }}
      >
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gridGap: 64,
            justifyContent: "center",
            "> div": {
              background: "green",
            },
            [`${getMinWidthMediaQuery("minMedium")}`]: {
              gridTemplateColumns: "repeat(auto-fill, 320px)",
            },
          }}
        >
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </div>
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
