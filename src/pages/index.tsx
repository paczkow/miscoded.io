import { useEffect } from "react";
import { graphql, navigate } from "gatsby";

const getRedirectLanguage = (langs: string[]) => {
  if (typeof navigator === `undefined`) {
    return "pl"; // TODO: change to defualt language from config
  }

  const lang =
    navigator && navigator.language && navigator.language.split("-")[0];
  if (!lang) return "pl";

  return langs.includes(lang) ? lang : "pl";
};

const IndexPage = ({
  data: {
    languages: { group },
  },
}: {
  data: { languages: { group: { fieldValue: string }[] } };
}) => {
  useEffect(() => {
    const langs = group.map(l => l.fieldValue);
    const urlLang = getRedirectLanguage(langs);

    navigate(`/${urlLang}`);
  }, []);

  return null;
};

export default IndexPage;

export const query = graphql`
  query {
    languages: allMarkdownRemark {
      group(field: frontmatter___language) {
        fieldValue
      }
    }
  }
`;
