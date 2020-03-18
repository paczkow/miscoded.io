import React, { useState } from "react";
import { graphql } from "gatsby";
import qs from "query-string";
import { Index } from "elasticlunr";

import { Box } from "../components/foundations/layout/Box/Box";
import { Layout } from "../components/Layout/Layout";
import { BackgroundImage } from "../components/BackgroundImage";
import { Form } from "../components/Search/Form";
import { FilteredPosts } from "../components/Search/Result";
import { search } from "../utils/search";

interface SearchProps {
  data: SearchQuery;
}

const Search: React.FC<SearchProps> = ({ data }) => {
  const { q: query, t: queryType } = qs.parse(location.search);
  const { tags, categories, searchIndex } = data;
  const [filteredIds, setFilteredIds] = useState<string[] | null>(
    search(query as string, queryType as string, searchIndex)
  );

  return (
    <Layout>
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
              onChange={ids => setFilteredIds(ids)}
            />
          </Box>
        </div>
      </BackgroundImage>
      <FilteredPosts filteredIds={filteredIds} />
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
}

export const query = graphql`
  {
    searchIndex: siteSearchIndex {
      index
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
