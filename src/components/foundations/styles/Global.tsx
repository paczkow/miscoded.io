import React from "react";
import { Global, css } from "@emotion/core";
import { withTheme } from "emotion-theming";

import { Theme } from "../../../theme";
import { getMinWidthMediaQuery } from "./media-queries";

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
          color: #424242;
          background: #fefefe;
          line-height: var(--baseline);
          font-family: "Roboto", sans-serif;
          margin: 0;
          padding: 0;
          outline: none;
          font-weight: 300;
        }

        *:focus {
          outline: none;
        }

        h1,
        h2,
        h3,
        h4 {
          color: #404040;
          margin: 0;
          padding: 0;
          font-weight: 400;
        }

        h1 {
          font-size: calc(var(--baseline) * 1.25rem);
        }

        h2 {
          font-size: calc(var(--baseline) * 1rem);
        }

        h3 {
          font-size: calc(var(--baseline) * 0.75rem);
        }

        h4 {
          font-size: calc(var(--baseline) * 0.75rem);
        }

        p {
          margin: 0;
        }

        a {
          text-decoration: none;
          color: black;
        }

        figcaption {
          font-size: 0.75rem;
          text-align: center;
          margin-top: 8px;
        }

        /* Adjust the position of the line numbers */
        .gatsby-highlight pre[class*="language-"].line-numbers {
          padding-left: 2.8em;
        }

        .gatsby-highlight {
          background-color: #2d2d2d;
          border-radius: 0.3em;
          margin: 0.5em 0;
          padding: 1em;
          overflow: auto;
        }

        .gatsby-highlight pre[class*="language-"].line-numbers {
          padding: 0;
          padding-left: 2.8em;
          overflow: initial;
        }

        div:not(.gatsby-highlight) code {
          font-size: 0.8em;
        }

        ${getMinWidthMediaQuery("minMedium")} {
          :root {
            --baseline: 1.7778;
          }
        }
      `}
    />
    {children}
  </React.Fragment>
);

export default withTheme(GlobalStyles);
