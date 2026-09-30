"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export function PasswordField({
  placeholder,
  value,
  onChange,
  error,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field-wrap">
      <div className={`field ${error ? "field--error" : ""}`}>
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field-input"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="field-toggle"
        >
          <Icon icon={visible ? "lucide:eye-off" : "lucide:eye"} width="16" />
        </button>
      </div>
      {error && <p className="field-error-text">{error}</p>}
    </div>
  );
}