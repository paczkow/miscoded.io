import React, { useState } from "react";
import { graphql } from "gatsby";

import { mapMarkdownRemarkToPost } from "../utils/mapMarkdownRemarkToPost";
import { Box } from "../components/layout/Box/Box";
import { Layout } from "../components/layout/Layout";
import { Top } from "../components/layout/Top";
import { Grid } from "../components/layout/Grid";
import { MobileCard } from "../components/Card/Mobile";
import { Card } from "../components/Card/Desktop";
import { Form } from "../components/Search/Form";
import { Index } from "elasticlunr";

interface SearchProps {
  data: SearchQuery;
}

const Search: React.FC<SearchProps> = ({ data }) => {
  const { tags, categories, posts, searchIndex } = data;
  const [filteredPosts, setFilteredPosts] = useState([] as Post[]);

  const handleChangeForm = (ids: string[] | null) => {
    setFilteredPosts(
      ids
        ? posts.edges
            .filter(({ node }) => ids.includes(node.id))
            .map(({ node }) => mapMarkdownRemarkToPost(node))
        : posts.edges.map(({ node }) => mapMarkdownRemarkToPost(node))
    );
  };

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
            <Form
              tags={tags.group}
              categories={categories.group}
              elasticLunrSearchIndex={searchIndex}
              onChange={handleChangeForm}
            />
            <Box paddingY="large">
              <h4 css={{ color: "#ffffff", textAlign: "center" }}>
                Znalezionych postów: {filteredPosts.length}
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
          {filteredPosts.map(post => (
            <div key={post.id}>
              <MobileCard {...post} />
              <Card {...post} />
            </div>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Search;

interface SearchQuery {
  searchIndex: {
    index: Index<any>;
  };
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
    searchIndex: siteSearchIndex {
      index
    }
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      edges {
        node {
          id
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
