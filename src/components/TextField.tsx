"use client";

import { InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  leftSlot?: React.ReactNode;
};

export function TextField({ error, leftSlot, className, ...props }: TextFieldProps) {
  return (
    <div className="field-wrap">
      <div className={`field ${error ? "field--error" : ""}`}>
        {leftSlot}
        <input {...props} className={`field-input ${className ?? ""}`} />
      </div>
      {error && <p className="field-error-text">{error}</p>}
    </div>
  );
}