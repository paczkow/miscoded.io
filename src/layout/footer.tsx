import React from 'react';
import { css } from '@emotion/core';
import { theme } from '../styles';

const Footer = () => {
  return (
    <footer
      css={css`
        height: 5rem;
        align-items: center;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        padding: ${theme.baseSpacing * 2}px 0;
        width: 100%;
        border-top: 1px solid rgb(243, 243, 243);
      `}
    >
      <h4
        css={css`
          margin: 0;
        `}
      >
        miscoded.io, 2020
      </h4>
      <span
        css={css`
          font-size: ${theme.baseSpacing * 2}px;
        `}
      >
        contact@miscoded.io
      </span>
    </footer>
  );
};

export default Footer;
