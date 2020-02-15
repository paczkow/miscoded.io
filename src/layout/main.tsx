import React from 'react';
import { css } from '@emotion/core';

import { theme, getMinWidthMediaQuery } from '../styles';

const Main: React.FC = ({ children }) => (
  <div
    css={css`
      display: flex;
      flex: 1;
      justify-content: center;
      margin: 0 auto;
      max-width: 100%;
      padding: 0 ${theme.baseSpacing * 2}px;
      width: 42em;

      ${getMinWidthMediaQuery('maxWidthOfNarrowPaddingContainer')} {
        padding: 0 ${theme.baseSpacing * 4}px;
      }

      ${getMinWidthMediaQuery('maxWidthOfDesktopContainer')} {
        padding: 0 calc(${theme.baseSpacing * 4}px - ((100vw - 42em) / 2));
      }
    `}
  >
    <main>{children}</main>
  </div>
);

export default Main;
