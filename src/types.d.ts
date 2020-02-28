type Dictionary<K extends string, T> = { [P in K]?: T };

interface PageContext {
  totalPages: number;
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

interface Post {
  id: string;
  categories: string[];
  date: string;
  excerpt: string;
  image: string;
  readingTime: number;
  slug: string;
  tags: string[];
  title: string;
}

interface MarkdowRemarkNode {
  id: string;
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
      node: MarkdowRemarkNode;
    }[];
  };
}
