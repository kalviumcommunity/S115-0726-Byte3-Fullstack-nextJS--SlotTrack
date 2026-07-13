import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // TODO: Define custom button props (variants, size, etc.)
}

export default function Button({ children, ...props }: ButtonProps) {
  // TODO: Reusable button primitive component with custom variants.
  return <></>;
}
