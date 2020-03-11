import React from "react";

interface ButtonProps {
  onClick?: (value: any) => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => (
  <button
    css={{
      background: "transparent",
      border: "2px solid #ffffff",
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 8,
      paddingRight: 8,
    }}
    onClick={onClick}
  >
    {children}
  </button>
);
