const MOJIBAKE_PATTERN = /Ã.|Â.|Ä.|Æ.|áº|á»|â€|â€“|â€”|ï¿½|�/;

const WINDOWS_1252_BYTES = new Map([
  [0x20ac, 0x80], [0x201a, 0x82], [0x0192, 0x83], [0x201e, 0x84],
  [0x2026, 0x85], [0x2020, 0x86], [0x2021, 0x87], [0x02c6, 0x88],
  [0x2030, 0x89], [0x0160, 0x8a], [0x2039, 0x8b], [0x0152, 0x8c],
  [0x017d, 0x8e], [0x2018, 0x91], [0x2019, 0x92], [0x201c, 0x93],
  [0x201d, 0x94], [0x2022, 0x95], [0x2013, 0x96], [0x2014, 0x97],
  [0x02dc, 0x98], [0x2122, 0x99], [0x0161, 0x9a], [0x203a, 0x9b],
  [0x0153, 0x9c], [0x017e, 0x9e], [0x0178, 0x9f],
]);

const LOSSY_VIETNAMESE_REPLACEMENTS = [
  [/Xu hư\?ng th\?i trang/gi, "Xu hướng thời trang"],
  [/Xu hu\?ng th\?i trang/gi, "Xu hướng thời trang"],
  [/M\?o ph\?i d\?/gi, "Mẹo phối đồ"],
  [/B\?o qu\?n/gi, "Bảo quản"],
  [/Chăm sóc qu\?n áo/gi, "Chăm sóc quần áo"],
  [/Cham sóc qu\?n áo/gi, "Chăm sóc quần áo"],
  [/Ch\? d\? du\?c d\?ng b\? t\? d\?ng t\? các bài vi\?t thu\?c nhóm/gi,
    "Chủ đề được đồng bộ tự động từ các bài viết thuộc nhóm"],
  [/Ch\? d\? du\?c d\?ng b\? t\? d\?ng t\? c\?c b\?i vi\?t thu\?c nh\?m/gi,
    "Chủ đề được đồng bộ tự động từ các bài viết thuộc nhóm"],
];

function repairKnownLossyVietnamese(value) {
  return LOSSY_VIETNAMESE_REPLACEMENTS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value
  );
}

export function normalizeVietnameseText(value) {
  if (typeof value !== "string") return value;
  let result = repairKnownLossyVietnamese(value);
  if (!MOJIBAKE_PATTERN.test(result)) return result.normalize("NFC");
  for (let attempt = 0; attempt < 2 && MOJIBAKE_PATTERN.test(result); attempt += 1) {
    const bytes = [];
    let convertible = true;
    for (const character of result) {
      const codePoint = character.codePointAt(0);
      if (codePoint <= 0xff) bytes.push(codePoint);
      else if (WINDOWS_1252_BYTES.has(codePoint)) bytes.push(WINDOWS_1252_BYTES.get(codePoint));
      else {
        convertible = false;
        break;
      }
    }
    if (!convertible) break;
    try {
      const repaired = new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
      if (repaired === result) break;
      result = repaired;
    } catch {
      break;
    }
  }
  return repairKnownLossyVietnamese(result).normalize("NFC");
}

export function normalizeVietnameseData(value) {
  if (typeof value === "string") return normalizeVietnameseText(value);
  if (Array.isArray(value)) return value.map(normalizeVietnameseData);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeVietnameseData(item)])
    );
  }
  return value;
}

export function repairVietnameseLocalStorage() {
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith("foxstyle_")) continue;
    const stored = localStorage.getItem(key);
    if (!stored || (!MOJIBAKE_PATTERN.test(stored) && !stored.includes("?"))) continue;
    try {
      localStorage.setItem(key, JSON.stringify(normalizeVietnameseData(JSON.parse(stored))));
    } catch {
      localStorage.setItem(key, normalizeVietnameseText(stored));
    }
  }
}
