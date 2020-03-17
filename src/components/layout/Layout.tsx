import React from "react";
import { Header } from "./Header";
import { GlobalStyles } from "../../styles";
import { Footer } from "./Footer";

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};
