import React from "react";
import { IntlProvider } from "react-intl";

import messages from "./translations/messages";
import { PageContextProvider } from "./src/context/Page";

// eslint-disable-next-line react/display-name
export const wrapPageElement = ({ element, props }) => {
  const locale = props.pageContext.langKey || props.pageContext.locale;
  return (
    <PageContextProvider value={props.pageContext}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <div>{element}</div>
      </IntlProvider>
    </PageContextProvider>
  );
};
