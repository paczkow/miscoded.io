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
        d="M175.336 93.6914L111.289 126.877V173.084C111.289 175.864 114.23 177.659 116.702 176.389L202.463 132.328C205.793 130.617 207.888 127.19 207.893 123.447L207.991 50.706C207.996 46.861 205.797 43.3536 202.333 41.6843L116.618 0.373089C114.151 -0.815974 111.289 0.981712 111.289 3.72045V50.4492L175.336 79.6126V93.6914ZM111.289 109.782V65.5338L159.587 87.6577L111.289 109.782ZM32.6554 160.717L96.7033 193.903V246.196L5.52852 199.354C2.19878 197.643 0.103349 194.216 0.0983214 190.473L0.000619401 117.732C-0.00453807 113.887 2.19526 110.379 5.65896 108.71L96.7033 64.8304V117.475L32.6554 146.638V160.717ZM96.7033 176.807V132.56L48.4049 154.683L96.7033 176.807Z"
        fill="url(#paint0_linear)"
      />
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="0.000610352"
        y="0"
        width="212.991"
        height="251.196"
        filterUnits="userSpaceOnUse"
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
        x1="0.000618893"
        y1="198.383"
        x2="190.157"
        y2="44.4786"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#232526" />
        <stop offset="1" stopColor="#414345" />
      </linearGradient>
    </defs>
  </svg>
);
