"use client";

import { ButtonHTMLAttributes } from "react";

export function Button({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`btn-primary ${className ?? ""}`}>
      {children}
    </button>
  );
}