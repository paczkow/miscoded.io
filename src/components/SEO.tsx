import React from "react";
import Helmet from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import { useIntl } from "react-intl";

const SEO: React.FC<{
  lang: string;
  description?: string;
  title?: string;
  image?: { src: string; width: string; height: string };
  pathname?: string;
}> = ({ lang, description, title, image: metaImage, pathname }) => {
  const intl = useIntl();
  const {
    site: { siteMetadata },
  } = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            title
            author
            keywords
            siteUrl
          }
        }
      }
    `
  );

  const metaTitle = title || siteMetadata.title;
  const metaDescription =
    description || intl.formatMessage({ id: "description" });
  const image =
    metaImage && metaImage.src
      ? `${siteMetadata.siteUrl}${metaImage.src}`
      : null;
  const canonical = pathname ? `${siteMetadata.siteUrl}${pathname}` : null;
  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      titleTemplate={`%s | ${metaDescription}`}
      link={
        canonical
          ? [
              {
                rel: "canonical",
                href: canonical,
              },
            ]
          : []
      }
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: "keywords",
          content: siteMetadata.keywords.join(","),
        },
        {
          property: `og:title`,
          content: metaTitle,
        },
        {
          property: `og:description`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          content: metaDescription as any,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:creator`,
          content: siteMetadata.twitterUser,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(
        metaImage
          ? [
              {
                property: "og:image",
                content: image,
              },
              {
                property: "og:image:width",
                content: metaImage.width,
              },
              {
                property: "og:image:height",
                content: metaImage.height,
              },
              {
                name: "twitter:card",
                content: "summary_large_image",
              },
            ]
          : [
              {
                name: "twitter:card",
                content: "summary",
              },
            ]
      )}
    />
  );
};

export default SEO;
