import { normalizeVietnameseText } from "./vietnameseText";

const BLOCKED_CONTENT_PATTERNS = [
  /\b(?:dit|djt|deo|dcm|dkm|dm|clm|vcl|duma|du ma|con cac|cai lon|loz|cac)\b/,
  /\b(?:fuck|shit|bitch|asshole)\b/,
];

export function containsBlockedLanguage(value) {
  const normalized = normalizeVietnameseText(String(value || ""))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return BLOCKED_CONTENT_PATTERNS.some((pattern) => pattern.test(normalized));
}
