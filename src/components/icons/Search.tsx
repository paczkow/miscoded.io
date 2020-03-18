import React from "react";

interface SearchIconProps {
  color?: string;
  className?: string;
}

export const Search: React.FC<SearchIconProps> = ({ color, className }) => (
  <svg
    width="24"
    height="24"
    className={className}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.96332 16.0552C13.4642 18.3663 18.2637 18.0098 21.364 14.9857C24.8787 11.5575 24.8787 5.99934 21.364 2.57114C17.8494 -0.857048 12.1511 -0.857048 8.63652 2.57114C5.32651 5.79976 5.13382 10.9176 8.05844 14.3662L0 22.2265L1.81822 24L9.96332 16.0552ZM19.5458 13.2122C17.0354 15.6609 12.9652 15.6609 10.4547 13.2122C7.9443 10.7635 7.9443 6.79337 10.4547 4.34466C12.9652 1.89595 17.0354 1.89595 19.5458 4.34466C22.0563 6.79337 22.0563 10.7635 19.5458 13.2122Z"
      fill={color}
    />
  </svg>
);
