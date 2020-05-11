import React from "react";

import { Header } from "./components/header";
import { GlobalStyles } from "../../styles";
import { Footer } from "./components/footer";

export const Layout: React.FC = ({ children }) => {
  return (
    <div css={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <GlobalStyles />
      <Header />
      <main css={{ flex: "1" }}>{children}</main>
      <Footer />
    </div>
  );
};
