import React from 'react';
import { css } from '@emotion/core';

import { Github, Linkedin, Rss, Twitter } from './social';
import { theme, getMinWidthMediaQuery } from '../styles';

export const Author = () => (
  <div
    css={css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      & h2,
      p {
        max-width: 20rem;
        text-align: center;
      }

      ${getMinWidthMediaQuery('maxWidthOfMobileContainer')} {
        flex-direction: row;
        & h2,
        p,
        ul {
          max-width: 25rem;
          text-align: left;
          margin: 0.75rem 0;
        }
      }
    `}
  >
    <div
      css={css`
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: #eee;
        flex-shrink: 0;
        ${getMinWidthMediaQuery('maxWidthOfMobileContainer')} {
          margin-right: ${theme.baseSpacing * 4}px;
          width: 160px;
          height: 160px;
        }
      `}
    ></div>
    <div>
      <h2>Cześć, tu Michał Paczków</h2>
      <p>
        Witam Cię w miejscu w którym weryfikuję swoją wiedzę dzieląc się nią z
        Tobą.
      </p>
      <ul
        css={css`
          list-style: none;
          display: flex;
          padding: 0;
          width: 100%;
          justify-content: center;

          ${getMinWidthMediaQuery('maxWidthOfMobileContainer')} {
            justify-content: flex-start;
          }

          & li:not(:last-child) {
            margin-right: ${theme.baseSpacing * 4}px;
          }
        `}
      >
        <li>
          <Twitter />
        </li>
        <li>
          <Github />
        </li>
        <li>
          <Linkedin />
        </li>
        <li>
          <Rss />
        </li>
      </ul>
    </div>
  </div>
);
