import { request } from "./apiClient";

const BACKUP_KEY = "foxstyle_daily_backups";

const readJson = (key, fallback = []) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

const localDateKey = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

export async function createDailyAdminBackup({ orders = [], products = [], users = [], coupons = [], currentUser } = {}) {
  if (currentUser?.role !== "admin") return { created: false, reason: "not-admin" };

  const today = localDateKey();
  const stored = readJson(BACKUP_KEY, []);
  const backups = Array.isArray(stored) ? stored : [];
  const existing = backups.find((backup) => backup?.date === today);
  const snapshot = existing || {
    id: `BACKUP-${today}`,
    date: today,
    createdAt: new Date().toISOString(),
    createdBy: currentUser?.fullName || currentUser?.username || "Quản trị viên",
    version: 2,
    data: {
      orders,
      products,
      users,
      coupons,
      warranties: readJson("foxstyle_warranties", []),
      articles: readJson("foxstyle_admin_articles", []),
      topics: readJson("foxstyle_admin_topics", []),
      brands: readJson("foxstyle_admin_brands", []),
      blockedPhones: readJson("foxstyle_blocked_phones", []),
      priceAudit: readJson("foxstyle_price_audit", []),
    },
  };

  const next = [snapshot, ...backups]
    .filter((backup, index, list) => index === list.findIndex((item) => item?.date === backup?.date))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  localStorage.setItem(BACKUP_KEY, JSON.stringify(next));
  await request("/daily-backups", {
    method: "POST",
    body: JSON.stringify({ date: today, createdBy: snapshot.createdBy, snapshot }),
  });
  window.dispatchEvent(new CustomEvent("foxstyle-backups-updated", { detail: next }));
  return { created: !existing, snapshot, backups: next };
}

export async function loadPermanentBackups() {
  const response = await request("/daily-backups");
  const backups = Array.isArray(response?.data) ? response.data : [];
  localStorage.setItem(BACKUP_KEY, JSON.stringify(backups));
  return backups;
}
