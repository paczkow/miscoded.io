/* eslint-disable @typescript-eslint/no-explicit-any */
import { Index } from "elasticlunr";

let searchIndex: Index<any>;

export const search = (
  query: string,
  queryType: string,
  elasticLunrSearchIndex: any
) => {
  searchIndex = getOrCreateSearchIndex(elasticLunrSearchIndex) as Index<any>;

  return query
    ? searchIndex
        .search(query ?? "", toSearchConfig(queryType))
        .map(({ ref }) => searchIndex?.documentStore.getDoc(ref))
        .map(item => item.id)
    : null;
};

const getOrCreateSearchIndex = (elasticLunrSearchIndex: any) =>
  searchIndex ? searchIndex : Index.load(elasticLunrSearchIndex.index);

const toSearchConfig = (queryType: string | undefined) => {
  switch (queryType) {
    case undefined:
      return {
        expand: true,
      };
    case "category":
      return {
        fields: {
          categories: { boost: 2 },
        },
      };
    case "tag":
      return {
        fields: {
          tags: { boost: 2 },
        },
      };
    default:
      return {
        expand: true,
      };
  }
};
