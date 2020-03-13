import React from "react";

interface ButtonProps {
  onClick?: (value: any) => void;
  isSelected: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  isSelected = false,
}) => (
  <button
    css={{
      background: `${isSelected ? "#ffffff" : "transparent"}`,
      border: "2px solid #ffffff",
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 8,
      paddingRight: 8,
      transition: "background 0.2s ease",
    }}
    onClick={onClick}
  >
    {children}
  </button>
);
