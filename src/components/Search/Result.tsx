import React, { useState, useEffect } from "react";
import { graphql, useStaticQuery } from "gatsby";

import { Box, Stack } from "../foundations/layout";
import { Grid } from "../Grid";
import { Posts } from "../Posts/Posts";
import { mapMarkdownRemarkToPost } from "../../utils/mapMarkdownRemarkToPost";

interface FilteredPostsProps {
  filteredIds: string[] | null;
}

interface FilteredPostsData {
  posts: {
    edges: {
      node: MarkdowRemarkNode;
    }[];
  };
}

export const FilteredPosts: React.FC<FilteredPostsProps> = ({
  filteredIds,
}) => {
  const [filteredPosts, setFilteredPosts] = useState([] as Post[]);
  const {
    posts: { edges },
  } = useStaticQuery<FilteredPostsData>(graphql`
    query {
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
    }
  `);

  useEffect(() => {
    setFilteredPosts(
      filteredIds
        ? edges
            .filter(({ node }) => filteredIds.includes(node.id))
            .map(({ node }) => mapMarkdownRemarkToPost(node))
        : edges.map(({ node }) => mapMarkdownRemarkToPost(node))
    );
  }, [filteredIds]);

  return (
    <>
      <Box
        paddingTop={["large", "xlarge"]}
        display="flex"
        justifyContent="center"
      >
        <h2>Znalezionych postów: {filteredPosts.length}</h2>
      </Box>
      <Box
        paddingY={["large", "xlarge"]}
        paddingX={["small", "large"]}
        css={{ display: "flex", justifyContent: "center" }}
      >
        <Posts data={filteredPosts} />
      </Box>
    </>
  );
};
