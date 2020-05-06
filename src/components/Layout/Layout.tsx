import React from "react";
import { IntlProvider } from "react-intl";

import { Header } from "./components/Header";
import { GlobalStyles } from "../foundations/styles";
import { Footer } from "./components/Footer";

import pl from "../../../translations/pl.json";

export const Layout: React.FC = ({ children }) => {
  return (
    <IntlProvider locale="pl" messages={pl}>
      <div
        css={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <GlobalStyles />
        <Header />
        <main css={{ flex: "1" }}>{children}</main>
        <Footer />
      </div>
    </IntlProvider>
  );
};
