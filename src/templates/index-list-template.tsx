import React from "react";
import { graphql } from "gatsby";

import { Layout } from "../components/layout";
import { Top } from "../components/layout/Top";

interface Props {
  pageContext: PageContext;
  data: AllMarkdownRemark;
}

const Index = () => {
  return (
    <Layout>
      <Top>Main</Top>
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
