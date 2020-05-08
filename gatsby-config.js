const remark = require("remark");
const stripMarkdown = require("strip-markdown");

const translations = require("./translations/config");
const config = require("./config");

module.exports = {
  siteMetadata: {
    title: config.title,
    author: config.author,
    siteUrl: config.url,
    description: translations.pl.description,
    keywords: translations.pl.keywords,
    social: {
      twitter: config.twitter,
      twitterUser: config.twitterUser,
      github: config.github,
      linkedin: config.linkedin,
      rss: config.rss,
    },
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description,
                siteUrl,
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  enclosure: edge.node.frontmatter.image && {
                    url:
                      site.siteMetadata.siteUrl +
                      edge.node.frontmatter.image.childImageSharp.fluid.src,
                  },
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  custom_elements: [{ "content:encoded": edge.node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  filter: { fields: { langKey: { eq: "pl" }}}
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt(pruneLength: 140)
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date(formatString: "DD MMMM YYYY")
                        image {
                          childImageSharp {
                            fluid {
                              src 
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Miscoded.io Blog RSS Feed (PL)",
            language: "pl",
            description: config.description,
          },
        ],
      },
    },
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
    {
      resolve: "gatsby-plugin-i18n",
      options: {
        langKeyDefault: "pl",
        useLangKeyLayout: false,
        pagesPaths: ["content/blog", "src/pages"],
        markdownRemark: {
          postPage: "src/templates/post.tsx",
          query: `
            {
              allMarkdownRemark {
                edges {
                  node {
                    fields {
                      slug,
                      langKey
                    }
                  }
                }
              }
            }
          `,
        },
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
