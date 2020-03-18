import React from "react";

interface ButtonProps {
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  isSelected = false,
  className,
}) => (
  <button
    css={{
      background: `${isSelected ? "#ffffff" : "transparent"}`,
      border: `2px solid ${isSelected ? "#ffffff" : "#aeaeae"}`,
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 8,
      paddingRight: 8,
      transition: "background 0.2s ease",
      cursor: "pointer",
      "&:hover": {
        border: "2px solid #ffffff",
      },
      "& > span": {
        fontSize: 14,
        color: `${isSelected ? "#000000" : "#aeaeae"}`,
      },
      "&:hover > span": {
        color: `${isSelected ? "#000000" : "#ffffff"}`,
      },
      className,
    }}
    onClick={onClick}
  >
    {children}
  </button>
);

export const TagButton: React.FC<ButtonProps> = ({
  children,
  ...buttonProps
}) => (
  <AbstractButton
    css={{
      background: "transparent",
      border: "2px solid #aeaeae",
      "&:hover": {
        border: "2px solid #555555",
        "& span": {
          color: "#555555",
        },
      },
      "& span": {
        color: "#aeaeae",
      },
    }}
    {...buttonProps}
  >
    {children}
  </AbstractButton>
);

const AbstractButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button
      className={className}
      css={{
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 8,
        paddingRight: 8,
        transition: "background 0.2s ease",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
