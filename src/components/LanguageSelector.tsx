import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'Português (Brasil)' },
  { code: 'en-US', flag: '🇺🇸', label: 'English (United States)' },
  { code: 'es-419', flag: '🇪🇸', label: 'Español (América Latina)' },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('leishcheck-language', code);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-[4.5rem] z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border/50 shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: 'hsl(var(--card) / 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        aria-label="Idioma / Language / Idioma"
      >
        <Globe className="h-5 w-5 text-primary" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* Bottom sheet */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-3xl border-t border-border/50 p-6 pb-8"
              style={{
                background: 'hsl(var(--card))',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />
              <h2 className="text-center text-lg font-bold text-foreground mb-5">
                🌐 Idioma / Language / Idioma
              </h2>
              <div className="flex flex-col gap-2">
                {LANGUAGES.map((lang) => {
                  const isActive = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`flex items-center gap-4 rounded-2xl p-4 text-left transition-colors ${
                        isActive
                          ? 'bg-primary/10 border-2 border-primary/30'
                          : 'hover:bg-muted/50 border-2 border-transparent'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="flex-1 text-base font-medium text-foreground">{lang.label}</span>
                      {isActive && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
