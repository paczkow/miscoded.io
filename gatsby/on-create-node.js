const { createFilePath } = require("gatsby-source-filesystem");
const path = require("path");

const onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({ node, getNode });
    const splitedPath = path.dirname(node.fileAbsolutePath).split("/");
    console.log(splitedPath.slice(-2)); //TODO: get locale and slug

    createNodeField({
      name: "slug",
      node,
      value: slug,
    });
  }
};

module.exports = onCreateNode;
