type Dictionary<K extends string, T> = { [P in K]?: T };

interface PageContext {
  locale: string;
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
  description?: string;
  categories: string[];
  date: string;
  excerpt: string;
  image: string;
  tracedSVG: string;
  readingTime: number;
  slug: string;
  tags: string[];
  title: string;
}

interface Site {
  siteMetadata: {
    description: string;
    social: {
      twitter: string;
      github: string;
      linkedin: string;
      rss: string;
    };
  };
}

interface MarkdowRemarkNode {
  id: string;
  excerpt: string;
  fields: {
    langKey: string;
    readingTime: {
      minutes: number;
    };
    slug: string;
  };
  frontmatter: {
    date: string;
    categories: string[];
    description?: string;
    image: {
      childImageSharp: {
        fluid: {
          src: string;
          tracedSVG: string;
        };
      };
    };
    imageCredit: string;
    tags: string[];
    title: string;
  };
  html?: string;
}

interface AllMarkdownRemark {
  edges: {
    node: MarkdowRemarkNode;
  }[];
}
