import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'uz', name: 'O‘zbekcha', label: 'UZ' },
  { code: 'en', name: 'English', label: 'EN' },
  { code: 'ru', name: 'Русский', label: 'RU' }
];

const LanguageSwitcher = ({ isMobile = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center gap-2 py-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded transition-colors ${
              i18n.language === lang.code
                ? 'bg-mavi-primary text-white'
                : 'bg-mavi-secondary text-mavi-text hover:bg-mavi-border'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs uppercase tracking-widest text-mavi-text hover:text-mavi-accent transition-colors font-medium border border-transparent hover:border-mavi-border rounded"
        title="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-mavi-muted" />
        <span>{currentLang.label}</span>
        <ChevronDown className="w-3 h-3 text-mavi-muted" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-mavi-border rounded-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between transition-colors ${
                i18n.language === lang.code
                  ? 'bg-mavi-secondary font-semibold text-mavi-primary'
                  : 'text-mavi-text hover:bg-mavi-secondary/50'
              }`}
            >
              <span>{lang.name}</span>
              <span className="text-[10px] text-mavi-muted font-mono">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
