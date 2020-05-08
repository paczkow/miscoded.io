const createPosts = require("./pages/posts");

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      groupedByLanguage: allMarkdownRemark {
        group(field: fields___langKey) {
          fieldValue
          nodes {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  createPosts(result.data.groupedByLanguage.group, createPage);
};

module.exports = createPages;
