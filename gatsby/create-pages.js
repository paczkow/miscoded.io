const path = require('path');

const createPosts = require('./pages/posts');
const createCategories = require('./pages/category');
const createTags = require('./pages/tag');

const groupByField = (edges, field) =>
  Object.entries(
    edges.reduce((acc, { node }) => {
      const groups = node.frontmatter[field] || [];
      groups.forEach(group => {
        acc[group] = (acc[group] || 0) + 1;
      });
      return acc;
    }, {})
  );

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  edges.forEach((post, _) => {
    createPage({
      path: post.node.fields.slug,
      component: path.resolve('src/templates/post-template.tsx'),
      context: {
        slug: post.node.fields.slug,
      },
    });
  });

  const categories = groupByField(edges, 'categories');
  const tags = groupByField(edges, 'tags');

  createPosts(edges, createPage);
  createCategories(categories, createPage);
  createTags(tags, createPage);
};

module.exports = createPages;
