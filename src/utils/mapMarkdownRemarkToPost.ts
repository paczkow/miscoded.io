export const mapMarkdownRemarkToPost = (
  markdownRemark: MarkdowRemarkNode
): Post => ({
  id: markdownRemark.id,
  title: markdownRemark.frontmatter.title,
  categories: markdownRemark.frontmatter.categories,
  tags: markdownRemark.frontmatter.tags,
  date: markdownRemark.frontmatter.date,
  image: markdownRemark.frontmatter.image.childImageSharp.fluid.src,
  excerpt: markdownRemark.excerpt,
  readingTime: markdownRemark.fields.readingTime.minutes,
  slug: markdownRemark.fields.slug,
});
