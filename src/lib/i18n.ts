"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en";
import fr from "@/locales/fr";
import zh from "@/locales/zh";
import ar from "@/locales/ar";
import de from "@/locales/de";
import es from "@/locales/es";
import hi from "@/locales/hi";
import ja from "@/locales/ja";
import pt from "@/locales/pt";
import ru from "@/locales/ru";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      zh: { translation: zh },
      ar: { translation: ar },
      de: { translation: de },
      hi: { translation: hi },
      ja: { translation: ja },
      pt: { translation: pt },
      ru: { translation: ru },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;
