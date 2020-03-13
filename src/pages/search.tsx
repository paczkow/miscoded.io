import React from "react";
import { graphql } from "gatsby";

import { mapMarkdownRemarkToPost } from "../utils/mapMarkdownRemarkToPost";
import { Box } from "../components/layout/Box/Box";
import { Layout } from "../components/layout/Layout";
import { Top } from "../components/layout/Top";
import { Grid } from "../components/layout/Grid";
import { MobileCard } from "../components/Card/Mobile";
import { Card } from "../components/Card/Desktop";
import { Form } from "../components/Search/Form";

interface SearchProps {
  data: SearchQuery;
}

const Search: React.FC<SearchProps> = ({ data }) => {
  const { tags, categories, posts } = data;

  return (
    <Layout>
      <Top>
        <div
          css={{
            maxWidth: 288,
            justifyContent: "center",
            alignContent: "center",
            padding: "64px 0 0 0",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Box paddingY="large">
            <Form tags={tags.group} categories={categories.group} />
            <Box paddingY="large">
              <h4 css={{ color: "#ffffff", textAlign: "center" }}>
                Znalezionych postów: 6
              </h4>
            </Box>
          </Box>
        </div>
      </Top>

      <Box
        paddingY={["large", "xlarge"]}
        paddingX={["small", "large"]}
        css={{ display: "flex", justifyContent: "center" }}
      >
        <Grid>
          {posts.edges.map(({ node }) => {
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

export default Search;

interface SearchQuery {
  tags: {
    group: { fieldValue: string }[];
  };
  categories: {
    group: { fieldValue: string }[];
  };
  posts: {
    edges: {
      node: MarkdowRemarkNode;
    }[];
  };
}

export const query = graphql`
  {
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
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
    tags: allMarkdownRemark {
      group(field: frontmatter___tags) {
        fieldValue
      }
    }
    categories: allMarkdownRemark {
      group(field: frontmatter___categories) {
        fieldValue
      }
    }
  }
`;
