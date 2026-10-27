"use client";

import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const language = i18n.resolvedLanguage?.split("-")[0] ?? "en";

  function changeLanguage(next: string) {
    window.localStorage.setItem("ct6-language", next);
    document.documentElement.lang = next;
    void i18n.changeLanguage(next);
  }

  return (
    <label className={compact ? "language-selector language-selector--compact" : "language-selector"}>
      <span className="sr-only">{t("Language")}</span>
      <select aria-label={t("Language")} value={language} onChange={(event) => changeLanguage(event.target.value)}>
        {languages.map(({ code, name, flag }) => (
          <option key={code} value={code}>{flag} {name}</option>
        ))}
      </select>
    </label>
  );
}
