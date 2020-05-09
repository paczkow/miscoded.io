import React from "react";

const PathPrefixContext = React.createContext<string>("/pl/blog");

export const PathPrefixContextProvider = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  return (
    <PathPrefixContext.Provider value={value}>
      {children}
    </PathPrefixContext.Provider>
  );
};

export const usePathPrefixContext = () => React.useContext(PathPrefixContext);
