import React from "react";
import { graphql, Link } from "gatsby";

import { Layout, Inline, Box, Stack, Top } from "../components/Layout";
import { Dot } from "../components/Dot";
import { Linkedin, Twitter } from "../components/Icons/Social";
import { getMinWidthMediaQuery } from "../styles";

interface PostTemplateProps {
  pageContext: PageContext;
  data: {
    markdownRemark: MarkdowRemarkNode;
  };
}

const PostTemplate: React.FC<PostTemplateProps> = ({ data }) => {
  const {
    frontmatter: { categories, title, date, tags, image },
    fields: { readingTime },
    html,
  } = data.markdownRemark;

  return (
    <Layout>
      <Top background={image.childImageSharp}>
        <Box paddingX="small" css={{ position: "relative", zIndex: 10 }}>
          <Stack space="large" align="center">
            <h1 css={{ color: "#ffffff", textAlign: "center" }}>{title}</h1>
            <Inline space="small">
              <span css={{ fontSize: 14, color: "#ffffff" }}>{date}</span>
              <span css={{ fontSize: 14, color: "#ffffff" }}>
                {Math.ceil(readingTime.minutes)} min. czytania
              </span>
            </Inline>
          </Stack>
        </Box>
        <small
          css={{
            zIndex: 10,
            position: "absolute",
            bottom: 8,
            color: "#efefef",
            fontSize: 12,
          }}
        >
          Zdjęcie: John Photo (unsphlash)
        </small>
      </Top>
      <Box
        paddingY={["large", "large"]}
        paddingX={["small", "large"]}
        css={{ maxWidth: "39rem", margin: "0 auto" }}
        justifyContent="center"
      >
        <Stack space={["medium", "medium", "large"]}>
          <Stack space="small">
            <Inline space="small">
              {categories.map(category => (
                <Link to={`/search?q=${category}&t=category`} key={category}>
                  <span
                    css={{
                      fontSize: 16,
                      color: "#555555",
                      "&:hover": { color: "#000000" },
                    }}
                  >
                    {category}
                  </span>
                </Link>
              ))}
            </Inline>
            <Share facebook="" twitter="" />
          </Stack>
          <div
            css={{
              "& > *": {
                marginBottom: 16,
              },
              [`${getMinWidthMediaQuery("minMedium")}`]: {
                fontSize: 20,
              },
            }}
            dangerouslySetInnerHTML={{ __html: html ?? "Content not provided" }}
          />
          <Stack space="large">
            <Inline space="small" align="center">
              <Dot /> <Dot /> <Dot />
            </Inline>
            <Stack align="center" space="small">
              <Inline space="small">
                {tags.map(tag => (
                  <Link to={`/search?q=${tag}&t=tag`} key={tag}>
                    <span
                      css={{
                        fontSize: 16,
                        color: "#555555",
                        "&:hover": {
                          color: "#000000",
                        },
                      }}
                    >{`#${tag.toLocaleLowerCase()}`}</span>
                  </Link>
                ))}
              </Inline>
              <Stack space="small" align="center">
                <a title="Twitter" href="">
                  <span css={{ fontWeight: 400 }}>Skomentuj (Twitter)</span>
                </a>
                <div css={{ display: "flex", alignItems: "center" }}>
                  <Share facebook="" twitter="" />
                </div>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
};

export default PostTemplate;

interface ShareProps {
  facebook: string;
  twitter: string;
}

const Share: React.FC<ShareProps> = ({ facebook, twitter }) => {
  const iconColors = {
    color: "#555555",
    hoverColor: "#000000",
  };

  return (
    <Inline space="small">
      <a title="Facebook" href={facebook}>
        <i>
          <Linkedin {...iconColors} />
        </i>
      </a>
      <a title="Twitter" href={twitter}>
        <i>
          <Twitter {...iconColors} />
        </i>
      </a>
    </Inline>
  );
};

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
