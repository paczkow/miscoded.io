import React from 'react';
import { Global, css } from '@emotion/core';
import { withTheme } from 'emotion-theming';

import { Theme } from './theme';
import { getMinWidthMediaQuery } from './media-queries';

const GlobalStyles: React.FC<{ theme: Theme }> = ({ children, theme }) => (
  <React.Fragment>
    <Global
      styles={css`
        :root {
          --baseline: 1.5;
        }

        html {
          box-sizing: border-box;
          font-size: 100%;
        }

        *,
        *:after,
        *:before {
          box-sizing: border-box;
        }

        body {
          background: ${theme.bgColor};
          color: ${theme.textPrimaryColor};
          line-height: var(--baseline);
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
        }

        h1,
        h2,
        h3,
        h4 {
          color: ${theme.textSecondaryColor};
        }

        h1 {
          font-size: calc(var(--baseline) * 1.25rem);
          margin-top: calc(var(--baseline) * 1rem);
          margin-bottom: calc(var(--baseline) * 1rem);
        }

        h2 {
          font-size: calc(var(--baseline) * 1rem);
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        h3 {
          font-size: calc(var(--baseline) * 1rem);
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        h4 {
          font-size: calc(var(--baseline) * 0.75rem);
          margin-top: calc(var(--baseline) * 0.75rem);
          margin-bottom: calc(var(--baseline) * 0.75rem);
        }

        p {
          margin: 0;
        }

        ${getMinWidthMediaQuery('maxWidthOfMobileContainer')} {
          :root {
            --baseline: 1.6;
          }

          html {
            font-size: 125%;
          }
        }
      `}
    />
    {children}
  </React.Fragment>
);

export default withTheme(GlobalStyles);
