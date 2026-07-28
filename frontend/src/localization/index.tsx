import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import hiIN from "antd/locale/hi_IN";
import koKR from "antd/locale/ko_KR";
import ruRU from "antd/locale/ru_RU";
import viVN from "antd/locale/vi_VN";
import zhCN from "antd/locale/zh_CN";
import type { Locale } from "antd/es/locale";
import {
  KEY_TRANSLATIONS,
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  TEXT_TRANSLATIONS,
  type LocalLanguage,
} from "./generatedTranslations";

type TranslationOptions = Record<string, unknown> & {
  defaultValue?: string;
};

type NamespaceInput = string | string[] | undefined;

const STORAGE_KEY = "marinaLanguage";
const LEGACY_STORAGE_KEY = "selectedLanguage";
const listeners = new Set<() => void>();
const textNodeSources = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();
let observer: MutationObserver | null = null;
let currentLanguage = getInitialLanguage();

const ANTD_LOCALES: Record<LocalLanguage, Locale> = {
  vi: viVN,
  en: enUS,
  ko: koKR,
  zh: zhCN,
  ru: ruRU,
  hi: hiIN,
};

function normalizeLanguage(language?: string | null): LocalLanguage {
  const normalized = (language || "vi").split("-")[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(normalized as LocalLanguage)
    ? (normalized as LocalLanguage)
    : "vi";
}

function getInitialLanguage(): LocalLanguage {
  if (typeof window === "undefined") return "vi";
  return normalizeLanguage(
    window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_STORAGE_KEY) ||
      window.navigator.language,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  for (const listener of listeners) listener();
}

function getSnapshot() {
  return currentLanguage;
}

export function changeLanguage(language: string) {
  const nextLanguage = normalizeLanguage(language);
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", nextLanguage);
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    window.localStorage.setItem(LEGACY_STORAGE_KEY, nextLanguage);
    window.localStorage.setItem("hasSelectedLanguage", "true");
  }

  if (currentLanguage !== nextLanguage) {
    currentLanguage = nextLanguage;
    notify();
  }

  translateDocument(nextLanguage);
  return Promise.resolve(nextLanguage);
}

function getReverseSource(text: string, language: LocalLanguage) {
  if (language === "vi") return text;

  for (const [source, translations] of Object.entries(TEXT_TRANSLATIONS)) {
    if (normalizeText(translations[language]) === text) return source;
  }

  return text;
}

function normalizeText(value?: string | null) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function applyInterpolation(value: string, options?: TranslationOptions) {
  if (!options) return value;

  return value.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, rawKey) => {
    const key = String(rawKey).trim();
    const replacement = options[key];
    return replacement === undefined || replacement === null
      ? match
      : String(replacement);
  });
}

export function translateText(
  source: string,
  language: LocalLanguage = currentLanguage,
  options?: TranslationOptions,
) {
  const normalizedSource = normalizeText(source);
  if (!normalizedSource) return source;

  const sourceKey = TEXT_TRANSLATIONS[normalizedSource]
    ? normalizedSource
    : getReverseSource(normalizedSource, language);
  const translated = TEXT_TRANSLATIONS[sourceKey]?.[language] || normalizedSource;

  return applyInterpolation(translated, options);
}

function getKeyCandidates(key: string, namespaces: string[]) {
  const candidates = [key];
  if (key.includes(":")) {
    const [namespace, nestedKey] = key.split(":");
    candidates.push(nestedKey, `${namespace}.${nestedKey}`);
  }

  for (const namespace of namespaces) {
    candidates.push(`${namespace}.${key}`);
  }

  return candidates;
}

function createTranslator(namespaces: NamespaceInput, language: LocalLanguage) {
  const namespaceList = Array.isArray(namespaces)
    ? namespaces
    : namespaces
      ? [namespaces]
      : [];

  return (
    key: string,
    fallbackOrOptions?: string | TranslationOptions,
    options?: TranslationOptions,
  ) => {
    const fallback =
      typeof fallbackOrOptions === "string"
        ? fallbackOrOptions
        : fallbackOrOptions?.defaultValue;
    const interpolationOptions =
      typeof fallbackOrOptions === "string" ? options : fallbackOrOptions;

    for (const candidate of getKeyCandidates(key, namespaceList)) {
      const translated = KEY_TRANSLATIONS[candidate]?.[language];
      if (translated) return applyInterpolation(translated, interpolationOptions);
    }

    if (fallback) return translateText(fallback, language, interpolationOptions);
    return key;
  };
}

export function useTranslation(namespaces?: NamespaceInput) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const t = useMemo(
    () => createTranslator(namespaces, language),
    [language, Array.isArray(namespaces) ? namespaces.join("|") : namespaces],
  );

  return {
    t,
    language,
    changeLanguage,
    labels: LANGUAGE_LABELS,
    supportedLanguages: SUPPORTED_LANGUAGES,
    ready: true,
  };
}

function shouldSkipNode(node: Node) {
  const parent = node.parentElement;
  if (!parent) return true;
  return Boolean(
    parent.closest(
      "script, style, noscript, svg, canvas, code, pre, textarea, [data-no-localize]",
    ),
  );
}

function translateTextNode(node: Text, language: LocalLanguage) {
  if (shouldSkipNode(node)) return;

  const raw = node.nodeValue || "";
  const normalized = normalizeText(raw);
  if (!normalized) return;

  const original = textNodeSources.get(node) || getReverseSource(normalized, language);
  textNodeSources.set(node, original);

  const translated = translateText(original, language);
  if (translated === normalized) return;

  const leading = raw.match(/^\s*/)?.[0] || "";
  const trailing = raw.match(/\s*$/)?.[0] || "";
  node.nodeValue = `${leading}${translated}${trailing}`;
}

function translateAttributes(element: Element, language: LocalLanguage) {
  if (element.closest("[data-no-localize]")) return;
  const attributes = ["placeholder", "title", "alt", "aria-label"];

  for (const attribute of attributes) {
    const value = element.getAttribute(attribute);
    const normalized = normalizeText(value);
    if (!normalized) continue;

    let sources = attributeSources.get(element);
    if (!sources) {
      sources = new Map();
      attributeSources.set(element, sources);
    }

    const original = sources.get(attribute) || getReverseSource(normalized, language);
    sources.set(attribute, original);

    const translated = translateText(original, language);
    if (translated !== normalized) element.setAttribute(attribute, translated);
  }
}

function walkAndTranslate(root: ParentNode, language: LocalLanguage) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => translateTextNode(node, language));

  if (root instanceof Element) translateAttributes(root, language);
  root.querySelectorAll?.("[placeholder], [title], [alt], [aria-label]").forEach(
    (element) => translateAttributes(element, language),
  );
}

export function translateDocument(language: LocalLanguage = currentLanguage) {
  if (typeof document === "undefined" || !document.body) return;
  walkAndTranslate(document.body, language);
}

export function LocalizationDomSync() {
  const { language } = useTranslation();

  useEffect(() => {
    if (typeof document === "undefined" || !document.body) return;

    document.documentElement.setAttribute("lang", language);
    translateDocument(language);

    observer?.disconnect();
    let frame = 0;
    observer = new MutationObserver((mutations) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const mutation of mutations) {
          if (mutation.type === "characterData" && mutation.target instanceof Text) {
            translateTextNode(mutation.target, language);
          }
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Text) translateTextNode(node, language);
            if (node instanceof Element) walkAndTranslate(node, language);
          });
          if (mutation.type === "attributes" && mutation.target instanceof Element) {
            translateAttributes(mutation.target, language);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "alt", "aria-label"],
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      observer = null;
    };
  }, [language]);

  return null;
}

export function LocalizedAntdProvider({ children }: { children: ReactNode }) {
  const { language } = useTranslation();

  return (
    <ConfigProvider locale={ANTD_LOCALES[language]}>
      {children}
    </ConfigProvider>
  );
}

export { LANGUAGE_LABELS, SUPPORTED_LANGUAGES };
export type { LocalLanguage };
