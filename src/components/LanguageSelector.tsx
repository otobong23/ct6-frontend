"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CN, FR, US } from "country-flag-icons/react/3x2";

const languages = [
  { code: "en", name: "English", flag: US },
  { code: "fr", name: "Français", flag: FR },
  { code: "zh", name: "中文", flag: CN },
];

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const language = i18n.resolvedLanguage?.split("-")[0] ?? "en";
  const currentLanguage = languages.find((item) => item.code === language) ?? languages[0];
  const CurrentFlag = currentLanguage.flag;

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) setIsOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function changeLanguage(next: string) {
    window.localStorage.setItem("ct6-language", next);
    void i18n.changeLanguage(next);
    setIsOpen(false);
  }

  return (
    <div className={`language-selector${compact ? " language-selector--compact" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className="language-selector-trigger"
        aria-label={`${t("Language")}: ${currentLanguage.name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <CurrentFlag aria-hidden="true" className="language-selector-flag" title={currentLanguage.name} />
        <span>{currentLanguage.name}</span>
        <svg aria-hidden="true" className="language-selector-chevron" viewBox="0 0 10 6">
          <path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </button>
      {isOpen && (
        <ul className="language-selector-menu" role="menu" aria-label={t("Language")}>
          {languages.map(({ code, name, flag: Flag }) => (
            <li key={code}>
              <button
                type="button"
                className="language-selector-option"
                role="menuitemradio"
                aria-checked={code === language}
                onClick={() => changeLanguage(code)}
              >
                <Flag aria-hidden="true" className="language-selector-flag" title={name} />
                <span>{name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
