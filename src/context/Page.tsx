import React from "react";

const PageContext = React.createContext("pl");

export const PageContextProvider = ({ value, children }) => {
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};

export const usePageContext = () => React.useContext(PageContext);
