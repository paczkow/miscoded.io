interface PageContext {
  currentPage: number;
  limit: number;
  skip: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  nextPagePath: string;
  prevPagePath: string;
}

interface TagContext extends PageContext {
  tag: string;
}

interface CategoryContext extends PageContext {
  category: string;
}

interface Node {
  excerpt: string;
  fields: {
    readingTime: {
      minutes: number;
    };
    slug: string;
  };
  frontmatter: {
    date: string;
    categories: string[];
    image: {
      childImageSharp: {
        fluid: {
          src: string;
        };
      };
    };
    tags: string[];
    title: string;
  };
  html?: string;
}

interface AllMarkdownRemark {
  allMarkdownRemark: {
    edges: {
      node: Node;
    }[];
  };
}
