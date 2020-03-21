const remark = require("remark");
const stripMarkdown = require("strip-markdown");

const config = require("./config");

module.exports = {
  siteMetadata: {
    title: config.title,
    author: config.author,
    siteUrl: config.url,
    description: "Blog programisty, nie tylko o programowaniu",
    social: {
      twitter: config.twitter,
      github: config.github,
      linkedin: config.linkedin,
      rss: config.rss,
    },
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-feed",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "assets",
        path: `${__dirname}/assets`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: `${__dirname}/content/blog`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 590,
            },
          },
          "gatsby-remark-reading-time",
          `gatsby-remark-prismjs`,
        ],
      },
    },
    "gatsby-plugin-use-query-params",
    "gatsby-plugin-emotion",
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: ["Roboto:300,400", "Source Code Pro:300"],
        },
      },
    },
    `gatsby-plugin-typescript`,
    {
      resolve: "@gatsby-contrib/gatsby-plugin-elasticlunr-search",
      options: {
        fields: ["title", "excerpt", "slug", "categories", "tags", "date"],
        resolvers: {
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            excerpt: node => {
              const text = remark()
                .use(stripMarkdown)
                .processSync(node.rawMarkdownBody);

              const excerptLength = 140;
              return String(text).substring(0, excerptLength);
            },
            slug: node => node.fields.slug,
            categories: node => node.frontmatter.categories,
            tags: node => node.frontmatter.tags,
            date: node => node.frontmatter.date,
          },
        },
      },
    },
  ],
};
