import { settingService } from "./settingService";

const MANAGED_KEYS = new Set([
  "foxstyle_admin_articles",
  "foxstyle_admin_topics",
  "foxstyle_admin_brands",
  "foxstyle_crm_events",
  "foxstyle_crm_rules",
  "foxstyle_crm_vouchers",
  "foxstyle_zalo_oa_connected",
  "foxstyle_flashsale",
  "foxstyle_auto_reply",
  "foxstyle_global_announcements",
  "foxstyle_blocked_phones",
  "foxstyle_daily_backups",
  "foxstyle_price_audit",
  "foxstyle_warranties"
]);

const MANAGED_PREFIXES = [
  "foxstyle_notifications_"
];

const isManagedKey = key =>
  MANAGED_KEYS.has(key) || MANAGED_PREFIXES.some(prefix => key.startsWith(prefix));

const databaseKey = key => `admin_data_${key}`;

const timers = new Map();
let installed = false;
let hydrating = false;

const persist = (key, value) => {
  window.clearTimeout(timers.get(key));
  timers.set(key, window.setTimeout(async () => {
    try {
      await settingService.upsert(databaseKey(key), value);
    } catch (error) {
      console.error(`Không thể đồng bộ ${key} vào database:`, error);
    }
  }, 250));
};

export async function initializeAdminDataSync() {
  hydrating = true;
  const browserKeys = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
    .filter(key => key && isManagedKey(key));
  const keys = [...new Set([...MANAGED_KEYS, ...browserKeys])];

  await Promise.all(keys.map(async key => {
    const browserValue = localStorage.getItem(key);
    try {
      const response = await settingService.getByKey(databaseKey(key));
      if (response?.data?.settingValue != null) {
        localStorage.setItem(key, response.data.settingValue);
      }
    } catch {
      // Lần đầu nâng cấp: đưa dữ liệu cũ của trình duyệt lên SQL Server.
      if (browserValue != null) {
        try {
          await settingService.upsert(databaseKey(key), browserValue);
        } catch (error) {
          console.error(`Không thể di chuyển ${key} vào database:`, error);
        }
      }
    }
  }));
  hydrating = false;

  if (!installed) {
    installed = true;
    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;

    Storage.prototype.setItem = function(key, value) {
      originalSetItem.call(this, key, value);
      if (this === localStorage && isManagedKey(key) && !hydrating) {
        persist(key, String(value));
      }
    };
    Storage.prototype.removeItem = function(key) {
      originalRemoveItem.call(this, key);
      if (this === localStorage && isManagedKey(key) && !hydrating) {
        persist(key, "null");
      }
    };
  }
}
