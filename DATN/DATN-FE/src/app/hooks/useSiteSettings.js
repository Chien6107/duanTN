import { useEffect, useState } from "react";
import { api } from "../services/api";

export const defaultSiteSettings = { site_name: "FoxStyle", site_logo: "/image_quan_tri/logo.jpg", site_phone: "0123 456 789", site_email: "support@foxstyle.vn", site_address: "Hà Nội & TP. Hồ Chí Minh", policy_returns: "Đổi trả trong vòng 7 ngày kể từ khi nhận hàng.", policy_warranty: "Hỗ trợ kiểm tra lỗi đường may, phom dáng và chất liệu theo tình trạng thực tế.", policy_tax: "Giá niêm yết đã bao gồm VAT theo mức thuế hiện hành.", policy_privacy: "Thông tin cá nhân chỉ được sử dụng để phục vụ giao dịch và chăm sóc khách hàng." };
let cache;
let pending;
const load = () => { if (cache) return Promise.resolve(cache); if (!pending) pending = api.settings.getSiteSettings().then(res => (cache = { ...defaultSiteSettings, ...(res.data || {}) })).finally(() => { pending = null; }); return pending; };
export function useSiteSettings() { const saved = (() => { try { return JSON.parse(localStorage.getItem("foxstyle_site_settings") || "null"); } catch { return null; } })(); const [settings, setSettings] = useState(cache || { ...defaultSiteSettings, ...(saved || {}) }); useEffect(() => { let active = true; const update = event => { cache = { ...defaultSiteSettings, ...(event.detail || {}) }; setSettings(cache); }; window.addEventListener("site-settings-updated", update); load().then(data => active && setSettings(data)).catch(() => {}); return () => { active = false; window.removeEventListener("site-settings-updated", update); }; }, []); return settings; }
