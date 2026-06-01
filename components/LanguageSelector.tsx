"use client";

import { useI18n } from "@/components/I18nProvider";
import { localeCookieName, locales, type Locale } from "@/lib/i18n";

export default function LanguageSelector() {
  const { dict, locale } = useI18n();

  function handleChange(nextLocale: string) {
    const typedLocale = nextLocale as Locale;
    document.cookie = `${localeCookieName}=${typedLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.localStorage.setItem(localeCookieName, typedLocale);
    window.location.reload();
  }

  return (
    <label className="flex items-center gap-2 text-xs font-bold text-slate-300">
      <span>{dict.language.label}</span>
      <select
        className="rounded-md border border-white/15 bg-slate-950 px-2 py-1 text-xs font-black text-white outline-none transition focus:border-cyan-200/70"
        onChange={(event) => handleChange(event.target.value)}
        value={locale}
      >
        {locales.map((availableLocale) => (
          <option key={availableLocale} value={availableLocale}>
            {availableLocale.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
