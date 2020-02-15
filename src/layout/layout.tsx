import React from 'react';
import { ThemeProvider } from 'emotion-theming';

import Main from './main';
import Footer from './footer';
import Header from './header';
import { GlobalStyles, theme } from '../styles';
import { css } from '@emotion/core';

const Layout: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        `}
      >
        <Header />
        <Main>{children}</Main>
        <Footer />
      </div>
    </GlobalStyles>
  </ThemeProvider>
);

export default Layout;
