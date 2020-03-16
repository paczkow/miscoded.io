import React from "react";
import { css } from "@emotion/core";

export const Dot = () => (
  <div
    css={css`
      width: 4px;
      height: 4px;
      background: #000;
      border-radius: 50%;
    `}
  />
);
