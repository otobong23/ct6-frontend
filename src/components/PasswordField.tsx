"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
          aria-label={visible ? t("Hide password") : t("Show password")}
          className="field-toggle"
        >
          <Icon icon={visible ? "fluent:eye-off-32-filled" : "fluent:eye-32-filled"} width="16" />
        </button>
      </div>
      {error && <p className="field-error-text">{t(error)}</p>}
    </div>
  );
}
