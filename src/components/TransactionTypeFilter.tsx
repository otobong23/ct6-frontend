"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TRANSACTION_TYPES, type TransactionType } from "@/lib/types";

type TransactionTypeFilterProps = {
  id: string;
  value: TransactionType | "all";
  onChange: (value: TransactionType | "all") => void;
  admin?: boolean;
};

function labelType(type: TransactionType) {
  if (type === "SYSTEM") return "System";
  return type.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function TransactionTypeFilter({ id, value, onChange, admin = false }: TransactionTypeFilterProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = value === "all" ? t("All transaction types") : t(labelType(value));

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) setIsOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div className={`transaction-type-filter${admin ? " transaction-type-filter--admin" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        id={id}
        className="transaction-type-filter-trigger"
        aria-label={`${t("Filter by type")}: ${selectedLabel}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{selectedLabel}</span>
        <svg aria-hidden="true" className="transaction-type-filter-chevron" viewBox="0 0 10 6">
          <path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
      </button>
      {isOpen && (
        <ul className="transaction-type-filter-menu" role="menu" aria-labelledby={id}>
          <li>
            <button type="button" className="transaction-type-filter-option" role="menuitemradio" aria-checked={value === "all"} onClick={() => { onChange("all"); setIsOpen(false); }}>
              {t("All transaction types")}
            </button>
          </li>
          {TRANSACTION_TYPES.map((type) => (
            <li key={type}>
              <button type="button" className="transaction-type-filter-option" role="menuitemradio" aria-checked={value === type} onClick={() => { onChange(type); setIsOpen(false); }}>
                {t(labelType(type))}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
