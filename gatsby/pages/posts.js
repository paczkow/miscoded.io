const path = require('path');

const siteConfig = require('../../config');

module.exports = (edges, createPage) => {
  const numPages = Math.ceil(edges.length / siteConfig.postsPerPage);
  for (let i = 0; i < numPages; i++) {
    createPage({
      path: i === 0 ? '/' : `/page/${i + 1}`,
      component: path.resolve('./src/templates/index-list-template.tsx'),
      context: {
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
};
