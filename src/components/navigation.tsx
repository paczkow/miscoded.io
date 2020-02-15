import React from "react";
import { Link } from "gatsby";
import { css, SerializedStyles } from "@emotion/core";
import { getMaxWidthMediaQuery } from "../styles";

interface Props {
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  nextPagePath: string;
  prevPagePath: string;
}

export const Navigation: React.FC<Props> = ({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  nextPagePath,
  prevPagePath,
}: Props) => (
  <div
    css={css`
      display: flex;
      justify-content: center;
      align-items: baseline;
      width: 100%;

      a {
        text-decoration: none;
      }

      ${getMaxWidthMediaQuery("maxWidthOfMobileContainer")} {
        margin-top: 2rem;
        margin-bottom: 1rem;
      }
    `}
  >
    {hasPrevPage && (
      <Link to={prevPagePath}>
        <Arrow
          css={css`
            transform: scaleX(-1);
          `}
        />
      </Link>
    )}
    <h4
      css={css`
        margin: 0 auto;
      `}
    >
      Strona {currentPage} z {totalPages}
    </h4>
    {hasNextPage && (
      <Link to={nextPagePath}>
        <Arrow />
      </Link>
    )}
  </div>
);

const Arrow: React.SFC<{ css?: SerializedStyles }> = (props: {
  css?: SerializedStyles;
}) => {
  return (
    <div
      css={css`
        align-items: center;
        background: #f0f0f0;
        border-radius: 50%;
        display: flex;
        height: 32px;
        justify-content: center;
        width: 32px;
      `}
      {...props}
    >
      <svg
        width="21"
        height="16"
        viewBox="0 0 21 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.2071 8.80183C20.5976 8.41131 20.5976 7.77814 20.2071 7.38762L13.8431 1.02366C13.4526 0.633134 12.8195 0.633134 12.4289 1.02366C12.0384 1.41418 12.0384 2.04735 12.4289 2.43787L18.0858 8.09473L12.4289 13.7516C12.0384 14.1421 12.0384 14.7753 12.4289 15.1658C12.8195 15.5563 13.4526 15.5563 13.8431 15.1658L20.2071 8.80183ZM0.5 9.09473H19.5V7.09473H0.5V9.09473Z"
          fill="#404040"
        />
      </svg>
    </div>
  );
};
