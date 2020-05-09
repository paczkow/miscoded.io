import React from "react";

export const Logo = ({
  color,
  width,
  height,
  className,
}: {
  color: string;
  width: string;
  height: string;
  className?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 126 150"
    fill={color}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M58.6143 117.932L20.0964 97.9744V89.5075L58.6143 71.9689V40.3088L3.0419 67.0924C1.45945 67.8551 0.454434 69.4575 0.456791 71.2142L0.517948 116.75C0.520245 118.46 1.47758 120.026 2.99883 120.808L58.6143 149.381V117.932ZM58.6143 81.0406V107.651L29.568 94.3458L58.6143 81.0406Z" />
    <path d="M67.3857 77.6234L105.904 57.6656V49.1987L67.3857 31.6601V2.90944C67.3857 1.56252 68.7933 0.678413 70.0066 1.2632L102.125 16.743C116.441 23.6428 125.534 38.1396 125.512 54.0316C125.491 69.504 116.831 83.6691 103.068 90.7397L70.0483 107.704C68.8322 108.329 67.3857 107.446 67.3857 106.079V77.6234ZM67.3857 40.7319V67.3422L96.432 54.037L67.3857 40.7319Z" />
  </svg>
);
