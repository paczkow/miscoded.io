const path = require("path");

const siteConfig = require("./config");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const {
    data: { groupByLanguage },
  } = await graphql(`
    query {
      groupByLanguage: allMarkdownRemark {
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

  const groups = groupByLanguage.group;
  console.log(groups);

  groups.forEach(group => {
    const locale = group.fieldValue;
    const numPages = Math.ceil(group.nodes.length / siteConfig.postsPerPage);

    const pathPrefix = `/${locale}/blog`;

    createPage({
      path: `${pathPrefix}/search`,
      component: path.resolve("./src/templates/search.tsx"),
      context: {
        locale,
      },
    });

    for (let i = 0; i < numPages; i++) {
      createPage({
        path: i === 0 ? `${pathPrefix}` : `${pathPrefix}/page/${i + 1}`,
        component: path.resolve("./src/templates/index.tsx"),

        context: {
          locale,
          totalPages: numPages,
          currentPage: i + 1,
          limit: siteConfig.postsPerPage,
          skip: i * siteConfig.postsPerPage,
          prevPagePath: i <= 1 ? `${pathPrefix}` : `${pathPrefix}/page/${i}`,
          nextPagePath: `${pathPrefix}/page/${i + 2}`,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numPages - 1,
        },
      });
    }
  });
};
