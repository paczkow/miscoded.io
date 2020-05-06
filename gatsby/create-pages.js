const path = require("path");

const createPosts = require("./pages/posts");

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      groupedByLanguage: allMarkdownRemark {
        group(field: frontmatter___language) {
          fieldValue
          nodes {
            fields {
              slug
            }
          }
        }
      }

      posts: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              language
            }
          }
        }
      }
    }
  `);
  const { edges } = result.data.posts;

  edges.forEach(({ node: { fields, frontmatter } }) => {
    createPage({
      path: `/${frontmatter.language}${fields.slug}`,
      component: path.resolve("src/templates/post.tsx"),
      context: {
        slug: fields.slug,
      },
    });
  });

  createPosts(result.data.groupedByLanguage.group, createPage);
};

module.exports = createPages;
