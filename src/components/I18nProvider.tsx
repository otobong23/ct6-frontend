"use client";

import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

export default function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const saved = window.localStorage.getItem("ct6-language");
    if (saved && ["en", "fr", "zh"].includes(saved)) {
      document.documentElement.lang = saved;
      void i18n.changeLanguage(saved);
    }
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
