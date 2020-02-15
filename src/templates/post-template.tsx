import React from "react";
import { graphql, Link } from "gatsby";
import { css } from "@emotion/core";

interface Props {
  pageContext: PageContext;
  data: {
    markdownRemark: MarkdowRemarkNode;
  };
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
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
`;
