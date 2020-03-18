const path = require("path");

const createPosts = require("./pages/posts");

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query blogPosts {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              date
              author
              categories
              tags
            }
            html
          }
        }
      }
    }
  `);
  const { edges } = result.data.allMarkdownRemark;

  edges.forEach((post, _) => {
    createPage({
      path: post.node.fields.slug,
      component: path.resolve("src/templates/post.tsx"),
      context: {
        slug: post.node.fields.slug,
      },
    });
  });

  createPosts(edges, createPage);
};

module.exports = createPages;
