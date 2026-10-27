"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AU, FR, GB, NG, US } from "country-flag-icons/react/3x2";

const countries = [
  { code: "+1", name: "United States / Canada", flag: US },
  { code: "+234", name: "Nigeria", flag: NG },
  { code: "+44", name: "United Kingdom", flag: GB },
  { code: "+33", name: "France", flag: FR },
  { code: "+61", name: "Australia", flag: AU },
];

function getParts(value: string) {
  const country = countries
    .slice()
    .sort((a, b) => b.code.length - a.code.length)
    .find(({ code }) => value.startsWith(code));

  return {
    countryCode: country?.code ?? "+1",
    number: country ? value.slice(country.code.length).replace(/\D/g, "") : value.replace(/\D/g, ""),
  };
}

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
};

export function PhoneInput({ value, onChange, placeholder, error, autoComplete = "tel-national" }: PhoneInputProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { countryCode, number } = getParts(value);
  const selectedCountry = countries.find((country) => country.code === countryCode) ?? countries[0];
  const SelectedFlag = selectedCountry.flag;

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) setIsOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div className="field-wrap">
      <div className={`phone-field ${error ? "field--error" : ""}`}>
        <div className="phone-country" ref={dropdownRef}>
          <button
            type="button"
            className="phone-country-trigger"
            aria-label={`Country calling code: ${selectedCountry.name} ${selectedCountry.code}`}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <SelectedFlag aria-hidden="true" className="phone-country-flag" title={selectedCountry.name} />
            <span>{selectedCountry.code}</span>
            <svg aria-hidden="true" className="phone-country-chevron" viewBox="0 0 10 6">
              <path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>
          {isOpen && (
            <ul className="phone-country-menu" role="menu" aria-label="Country calling codes">
              {countries.map((country) => (
                <li key={country.code}>
                  <button
                    type="button"
                    className="phone-country-option"
                    role="menuitemradio"
                    aria-checked={country.code === countryCode}
                    onClick={() => {
                      onChange(`${country.code}${number}`);
                      setIsOpen(false);
                    }}
                  >
                    <country.flag aria-hidden="true" className="phone-country-flag" title={country.name} />
                    <span>{country.name}</span>
                    <span className="phone-country-option-code">{country.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={number}
          onChange={(event) => onChange(`${countryCode}${event.target.value.replace(/\D/g, "")}`)}
          className="field-input"
        />
      </div>
      {error && <p className="field-error-text">{t(error)}</p>}
    </div>
  );
}
