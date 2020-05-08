import React from "react";
import { PageContextProvider } from "./src/context/Page";

// eslint-disable-next-line react/display-name
export const wrapPageElement = ({ element, props }) => {
  return (
    <PageContextProvider value={props.pageContext}>
      <div>{element}</div>
    </PageContextProvider>
  );
};
