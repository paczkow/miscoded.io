import React from "react";
import { IntlProvider } from "react-intl";

import messages from "./translations/messages";
import { PathPrefixContextProvider } from "./src/context/path-prefix-context";

// eslint-disable-next-line react/display-name
export const wrapPageElement = ({ element, props }) => {
  const locale = props.pageContext.langKey || props.pageContext.locale;
  const pathPrefix = `/${locale}/blog`;
  return (
    <PathPrefixContextProvider value={pathPrefix}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div>{element}</div>
      </IntlProvider>
    </PathPrefixContextProvider>
  );
};
