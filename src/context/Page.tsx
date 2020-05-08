import React from "react";

const PageContext = React.createContext({});
//TODO: add types
export const PageContextProvider = ({ value, children }) => {
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

export const usePageContext = () => React.useContext(PageContext);
