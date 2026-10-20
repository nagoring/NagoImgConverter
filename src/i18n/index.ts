import { useCallback } from "react";
import { create } from "zustand";
import { ja, type MessageKey, type Messages } from "./locales/ja";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { de } from "./locales/de";
import { fr } from "./locales/fr";

export type Lang = "ja" | "en" | "es" | "de" | "fr";

const MESSAGES: Record<Lang, Messages> = { ja, en, es, de, fr };

// Each language is shown in its own name so users can always find theirs.
export const LANGUAGES: { value: Lang; label: string }[] = [
  { value: "ja", label: "日本語" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
];

const STORAGE_KEY = "nago-img-converter.lang";

function isLang(v: unknown): v is Lang {
  return typeof v === "string" && v in MESSAGES;
}

/// Saved choice first, then the OS/browser language, then English.
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // storage unavailable
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split("-")[0];
    if (isLang(base)) return base;
  }
  return "en";
}

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  lang: detectLang(),
  setLang: (lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage unavailable
    }
    document.documentElement.lang = lang;
    set({ lang });
  },
}));

document.documentElement.lang = useI18nStore.getState().lang;

export type TranslateParams = Record<string, string | number>;

function format(lang: Lang, key: MessageKey, params?: TranslateParams): string {
  const msg = MESSAGES[lang][key] ?? ja[key] ?? key;
  if (!params) return msg;
  return msg.replace(/\{(\w+)\}/g, (m, name) =>
    name in params ? String(params[name]) : m
  );
}

/// Non-hook translator for use outside components (alerts, dialogs).
export function translate(key: MessageKey, params?: TranslateParams): string {
  return format(useI18nStore.getState().lang, key, params);
}

export function useT() {
  const lang = useI18nStore((s) => s.lang);
  return useCallback(
    (key: MessageKey, params?: TranslateParams) => format(lang, key, params),
    [lang]
  );
}

export type { MessageKey };
