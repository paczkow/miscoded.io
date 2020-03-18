import React from "react";
import { Header } from "./components/Header";
import { GlobalStyles } from "../foundations/styles";
import { Footer } from "./components/Footer";

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
