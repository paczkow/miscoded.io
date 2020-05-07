const path = require("path");

const siteConfig = require("../../config");

module.exports = (groups, createPage) => {
  groups.forEach(group => {
    const locale = group.fieldValue;
    const numPages = Math.ceil(group.nodes.length / siteConfig.postsPerPage);

    createPage({
      path: `/${locale}/search`,
      component: path.resolve("./src/templates/search.tsx"),
      context: {
        locale,
      },
    });

    for (let i = 0; i < numPages; i++) {
      createPage({
        path: i === 0 ? `/${locale}` : `/${locale}/page/${i + 1}`,
        component: path.resolve("./src/templates/index.tsx"),

        context: {
          locale,
          totalPages: numPages,
          currentPage: i + 1,
          limit: siteConfig.postsPerPage,
          skip: i * siteConfig.postsPerPage,
          prevPagePath: i <= 1 ? `/${locale}` : `/${locale}/page/${i}`,
          nextPagePath: `/${locale}/page/${i + 2}`,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numPages - 1,
        },
      });
    }
  });
};
