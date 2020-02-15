const { paramCase } = require('param-case');
const path = require('path');

const siteConfig = require('../../config');

module.exports = (categories, createPage) => {
  categories.forEach(([category, totalCount]) => {
    const categorySlug = `/category/${paramCase(category)}`;
    const numPages = Math.ceil(totalCount / siteConfig.postsPerPage);

    for (let i = 0; i < numPages; i++) {
      createPage({
        path: i === 0 ? `${categorySlug}` : `${categorySlug}/${i + 1}`,
        component: path.resolve('./src/templates/category-template.tsx'),
        context: {
          category,
          currentPage: i === 0 ? 0 : i + 1,
          limit: siteConfig.postsPerPage,
          skip: i * siteConfig.postsPerPage,
          prevPagePath: i <= 1 ? '/' : `/page/${i}`,
          nextPagePath: `/page/${i + 2}`,
          hasPrevPage: i !== 0,
          hasNextPage: i !== numPages - 1,
        },
      });
    }
  });
};
