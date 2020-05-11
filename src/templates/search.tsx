/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from "react";
import { WindowLocation } from "@reach/router";
import { graphql } from "gatsby";
import { FormattedMessage } from "react-intl";
import qs from "query-string";
import { Index } from "elasticlunr";

import { Box } from "../components/foundations/Box/Box";
import { Layout } from "../components/Layout/Layout";
import { BackgroundImage } from "../components/BackgroundImage";
import { Form } from "../components/Search/Form";
import { search } from "../utils/search";
import { Posts } from "../components/Posts/Posts";
import { mapMarkdownRemarkToPost } from "../utils/mapMarkdownRemarkToPost";
import SEO from "../components/SEO";

interface SearchProps {
  data: SearchQuery;
  pageContext: PageContext;
  location: WindowLocation;
}

const Search: React.FC<SearchProps> = ({ data, pageContext, location }) => {
  const { posts, tags, categories, searchIndex } = data;

  const filterPosts = (filteredIds: string[] | null) =>
    filteredIds
      ? posts.edges
          .filter(({ node }) => filteredIds.includes(node.id))
          .map(({ node }) => mapMarkdownRemarkToPost(node))
      : posts.edges.map(({ node }) => mapMarkdownRemarkToPost(node));

  const { q: query, t: queryType } = qs.parse(location.search);
  const [filteredPosts, setFilteredPosts] = useState(
    filterPosts(search(query as string, queryType as string, searchIndex))
  );

  const handleOnChange = (ids: string[] | null) =>
    setFilteredPosts(filterPosts(ids));

  return (
    <Layout>
      <SEO lang={pageContext.locale} />
      <BackgroundImage>
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
              onChange={handleOnChange}
            />
          </Box>
        </div>
      </BackgroundImage>

      <Box
        paddingTop={["large", "xlarge"]}
        display="flex"
        justifyContent="center"
      >
        <h2>
          <FormattedMessage id="search.found-posts" />: {filteredPosts.length}
        </h2>
      </Box>
      <Box
        paddingY={["large", "xlarge"]}
        paddingX={["small", "large"]}
        css={{ display: "flex", justifyContent: "center" }}
      >
        <Posts data={filteredPosts} />
      </Box>
    </Layout>
  );
};

export default Search;

interface SearchQuery {
  searchIndex: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    index: Index<any>;
  };
  posts: AllMarkdownRemark;
  tags: {
    group: { fieldValue: string }[];
  };
  categories: {
    group: { fieldValue: string }[];
  };
}

export const query = graphql`
  query($locale: String!) {
    posts: allMarkdownRemark(
      filter: { fields: { langKey: { eq: $locale } } }
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
    searchIndex: siteSearchIndex {
      index
    }
    tags: allMarkdownRemark(filter: { fields: { langKey: { eq: $locale } } }) {
      group(field: frontmatter___tags) {
        fieldValue
      }
    }
    categories: allMarkdownRemark(
      filter: { fields: { langKey: { eq: $locale } } }
    ) {
      group(field: frontmatter___categories) {
        fieldValue
      }
    }
  }
`;
