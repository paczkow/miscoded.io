import React from "react";
import { graphql, Link } from "gatsby";
import { css } from "@emotion/core";
import { Layout } from "../components/layout";
import { Top } from "../components/layout/Top";
import { Stack } from "../components/layout/Stack";
import { Inline } from "../components/layout/Inline";
import { Box } from "../components/layout/Box/Box";
import { Dot } from "../components/dot";
import { Button } from "../components/Button";
import { Linkedin, Twitter } from "../components/icons/social";

interface PostTemplateProps {
  pageContext: PageContext;
  data: {
    markdownRemark: MarkdowRemarkNode;
  };
}

const PostTemplate: React.FC<PostTemplateProps> = ({ data }) => {
  const {
    frontmatter: { categories, title, date, tags },
    fields: { readingTime },
    html,
  } = data.markdownRemark;

  return (
    <Layout>
      <Top>
        <Box css={{ position: "relative", zIndex: 10 }}>
          <Stack space={["large", "xlarge"]} align="center">
            <h1 css={{ color: "#ffffff", textAlign: "center" }}>{title}</h1>
            <Inline space="xsmall">
              <span css={{ color: "#ffffff" }}>{date}</span>
              <span css={{ color: "#ffffff" }}>
                {readingTime.minutes} min. czytania
              </span>
            </Inline>
          </Stack>
        </Box>
      </Top>
      <Box
        paddingY={["large", "xlarge"]}
        paddingX={["small", "large"]}
        css={{ maxWidth: "39rem", margin: "0 auto" }}
        justifyContent="center"
      >
        <Stack space={["medium", "medium", "xlarge"]}>
          <Inline space="xsmall">
            {categories.map(category => (
              <span key={category}>{category}</span>
            ))}
          </Inline>
          <div
            dangerouslySetInnerHTML={{ __html: html ?? "Content not provided" }}
          />
          <Stack align="center" space="medium">
            <Inline space="small">
              <Dot /> <Dot /> <Dot />
            </Inline>
            <Inline space="xsmall">
              {tags.map(tag => (
                <Button key={tag}>{tag}</Button>
              ))}
            </Inline>
            <Inline space="xsmall" align="center">
              <span>Skomentuj</span>
              <Dot />
              <span>
                Udostępnij:
                <i css={{ marginLeft: 16 }}>
                  <Linkedin />
                </i>
                <i css={{ marginLeft: 16 }}>
                  <Twitter />
                </i>
              </span>
            </Inline>
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
};

export default PostTemplate;

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
