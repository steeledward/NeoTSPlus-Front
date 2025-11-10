
import esFlag from "@/assets/flags/es.svg";
import enFlag from "@/assets/flags/en.svg";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";


const languages = [
  { code: "es", label: "Español", flag: esFlag },
  { code: "en", label: "English", flag: enFlag },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="flex justify-end w-full mb-2">
      <div className="relative inline-block" ref={ref}>
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          tabIndex={0}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <img
            src={languages.find(l => l.code === current)?.flag}
            alt={languages.find(l => l.code === current)?.label + ' flag'}
            className="w-5 h-5 rounded-full border border-gray-200"
          />
          <span className="font-medium text-gray-700">{languages.find(l => l.code === current)?.label}</span>
          <svg className={`ml-2 w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-20 animate-fade-in">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center w-full gap-2 px-3 py-2 hover:bg-blue-50 transition text-left ${current === lang.code ? 'bg-blue-100 font-semibold' : ''}`}
                disabled={current === lang.code}
              >
                <img src={lang.flag} alt={lang.label + ' flag'} className="w-5 h-5 rounded-full border border-gray-200" />
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
