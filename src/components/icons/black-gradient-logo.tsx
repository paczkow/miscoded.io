import React from "react";

export const BlackGradientLogo = ({
  width,
  height,
  className,
}: {
  width: string;
  height: string;
  className?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 256 302"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g filter="url(#filter0_d)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M210.894 113.136L133.858 153.051V209.862C133.858 212.642 136.799 214.437 139.272 213.167L205.223 179.284C232.747 165.143 250.069 136.813 250.111 105.868C250.153 74.0837 231.969 45.0902 203.337 31.2907L139.187 0.373089C136.72 -0.815974 133.858 0.981711 133.858 3.72045V61.1248L210.894 96.202V113.136ZM133.858 132.489V79.2683L191.95 105.879L133.858 132.489ZM39.279 193.754L116.315 233.669V296.566L5.16652 239.462C2.07331 237.873 0.126733 234.69 0.122063 231.212L8.43363e-06 140.329C-0.00479046 136.757 2.03874 133.499 5.25639 131.948L116.315 78.4223V141.742L39.279 176.82V193.754ZM116.315 213.107V159.886L58.2223 186.496L116.315 213.107Z"
        fill="url(#paint0_linear)"
      />
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="0"
        y="0"
        width="255.111"
        height="301.566"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx="4" dy="4" />
        <feGaussianBlur stdDeviation="0.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.898039 0 0 0 0 0.898039 0 0 0 0 0.898039 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear"
        x1="1.02706e-05"
        y1="238.971"
        x2="228.978"
        y2="53.9665"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#232526" />
        <stop offset="1" stopColor="#414345" />
      </linearGradient>
    </defs>
  </svg>
);
