import React, { useState, useEffect } from "react";
import { Grid } from "../Layout/Grid";
import { Box } from "..";
import { MobileCard } from "../Card/Mobile";
import { Card } from "../Card/Desktop";
import { mapMarkdownRemarkToPost } from "../../utils/mapMarkdownRemarkToPost";
import { graphql, useStaticQuery } from "gatsby";

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
  );
};
