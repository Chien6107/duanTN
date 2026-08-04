import { request } from "./apiClient";

export const financeService = {
  getReport: (period = "month") => request(`/reports/finance?period=${period}`),
  recordStockImport: (data) => request("/stock-imports", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  createStockReceipt: (data) => request("/stock-import-receipts", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  getStockReceipts: () => request("/stock-import-receipts"),
};
