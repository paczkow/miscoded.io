import React from "react";
import { graphql } from "gatsby";

import { Layout } from "../components/layout";
import { Top } from "../components/layout/Top";
import { Box } from "../components/layout/Box/Box";
import { getMinWidthMediaQuery } from "../styles/media-queries";
import { Stack } from "../components/layout/Stack";
import { MobileCard } from "../components/Card/Mobile";
import { mapMarkdownRemarkToPost } from "../utils/mapMarkdownRemarkToPost";
import { Card } from "../components/Card/Desktop";

interface Props {
  pageContext: PageContext;
  data: AllMarkdownRemark;
}

const Index = ({ data }: Props) => {
  const { allMarkdownRemark } = data;

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
            WITAM CIĘ W MIEJSCU W KTÓRYM WERYFIKUJĘ WIEDZĘ SWOJA DZIELĄC SIĘ NIĄ
            Z TOBĄ
          </div>
          <div css={{ position: "relative", zIndex: 1000, color: "#ffffff" }}>
            MICHAŁ PACZKÓW
          </div>
        </Stack>
      </Top>
      <Box
        paddingY={["large", "xlarge"]}
        paddingX={["small", "large"]}
        css={{ display: "flex", justifyContent: "center" }}
      >
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(288px, 1fr))",
            gridGap: 32,
            justifyContent: "center",
            justifyItems: "center",
            width: "100%",
            [`${getMinWidthMediaQuery("minLarge")}`]: {
              gridGap: 64,
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              maxWidth: 1600,
            },
          }}
        >
          {allMarkdownRemark.edges.map(({ node }) => {
            const postData = mapMarkdownRemarkToPost(node);

            return (
              <>
                <MobileCard {...postData} />
                <Card {...postData} />
              </>
            );
          })}
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
