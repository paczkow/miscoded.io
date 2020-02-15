const { paramCase } = require("param-case");
const path = require("path");

const siteConfig = require("../../config");

module.exports = (tags, createPage) => {
  tags.forEach(([tag, totalCount]) => {
    const categorySlug = `/tag/${paramCase(tag)}`;
    const numPages = Math.ceil(totalCount / siteConfig.postsPerPage);

    for (let i = 0; i < numPages; i++) {
      createPage({
        path: i === 0 ? `${categorySlug}` : `${categorySlug}/${i + 1}`,
        component: path.resolve("./src/templates/tag-template.tsx"),
        context: {
          tag,
          totalPages: numPages,
          currentPage: i + 1,
          limit: siteConfig.postsPerPage,
          skip: i * siteConfig.postsPerPage,
          prevPagePath: i <= 1 ? "/" : `/page/${i}`,
          nextPagePath: `/page/${i + 2}`,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numPages - 1,
        },
      });
    }
  });
};
