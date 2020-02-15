import React from 'react';
import { css } from '@emotion/core';
import { useInView } from 'react-intersection-observer';

import { theme, getMinWidthMediaQuery, getMaxWidthMediaQuery } from '../styles';

const SearchIcon = () => {
  return (
    <svg
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      css={css`
        & path {
          fill: #000;
        }
      `}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.74949 12.8025C10.4725 14.6454 14.2056 14.3612 16.617 11.9497C19.3507 9.21608 19.3507 4.78392 16.617 2.05025C13.8833 -0.683418 9.45117 -0.683418 6.7175 2.05025C4.14297 4.62478 3.99309 8.7058 6.26787 11.4557L0 17.7236L1.41421 19.1378L7.74949 12.8025ZM15.2028 10.5355C13.2502 12.4882 10.0843 12.4882 8.13171 10.5355C6.17909 8.58291 6.17909 5.41709 8.13171 3.46447C10.0843 1.51184 13.2502 1.51184 15.2028 3.46447C17.1554 5.41709 17.1554 8.58291 15.2028 10.5355Z"
      />
    </svg>
  );
};

const Header: React.FC = () => {
  const [ref, inView] = useInView({
    rootMargin: '1px',
  });

  return (
    <React.Fragment>
      <span ref={ref} />
      <header
        css={css`
          align-items: center;
          display: flex;
          justify-content: center;
          position: sticky;
          top: 0;
          background: ${theme.bgColor};
          padding: 0 ${theme.baseSpacing * 2}px;
          height: 4rem;

          &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            width: 100%;
            height: 100%;
            box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 15px;
            opacity: ${inView ? 0 : 1};
            transition: opacity 0.5s ease;
          }

          & * {
            margin-left: auto;
            margin-bottom: 0px;
            margin-top: 0px;
          }

          & svg {
            width: 1rem;
            height: 1rem;
          }

          ${getMaxWidthMediaQuery('maxWidthOfNarrowPaddingContainer')} {
            & h1 {
              font-size: 28px;
            }
          }

          ${getMinWidthMediaQuery('maxWidthOfMobileContainer')} {
            padding: 0 ${theme.baseSpacing * 4}px;
          }
        `}
      >
        <h1>MISCODED.IO</h1>
        <SearchIcon />
      </header>
    </React.Fragment>
  );
};

export default Header;
