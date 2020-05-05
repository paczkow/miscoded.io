const path = require("path");

const siteConfig = require("../../config");

module.exports = (edges, createPage) => {
  const numPages = Math.ceil(edges.length / siteConfig.postsPerPage);
  for (let i = 0; i < numPages; i++) {
    createPage({
      path: i === 0 ? "/" : `/page/${i + 1}`,
      component: path.resolve("./src/templates/index.tsx"),
      //TODO: pass locale here to compare with allMarkdowRemark in src/tempalates/index
      // like for slug for posts
      context: {
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
};
