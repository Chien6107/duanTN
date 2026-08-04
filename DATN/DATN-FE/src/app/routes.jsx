import React, { lazy, Suspense } from "react";
import { createBrowserRouter, useRouteError, Link } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { HomePage } from "./pages/HomePage";

// Custom Error Boundary Component
const ErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route Error Caught:", error);

  const errorDetails = error?.message || error?.statusText || (typeof error === "string" ? error : JSON.stringify(error));

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
        !
      </div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Đã xảy ra sự cố không mong muốn</h2>
      <p className="text-xs text-red-600 dark:text-red-400 max-w-lg mb-6 font-mono bg-red-50 dark:bg-red-950/60 p-3 rounded-xl border border-red-200 dark:border-red-900 break-all text-left">
        {errorDetails}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition cursor-pointer"
        >
          Tải lại trang
        </button>
        <a
          href="/"
          className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Trang chủ
        </a>
      </div>
    </div>
  );
};


// Page Fallback Loader Component
const LoadingSpinner = () => (
  <div className="min-h-[60vh] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 animate-pulse">Đang tải trang...</span>
    </div>
  </div>
);

const withSuspense = (LazyComponent) => {
  return function SuspendedComponent(props) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// Lazy load non-critical customer pages
const ProductsPage = withSuspense(lazy(() => import("./pages/ProductsPage").then(m => ({ default: m.ProductsPage }))));
const ProductDetailPage = withSuspense(lazy(() => import("./pages/ProductDetailPage").then(m => ({ default: m.ProductDetailPage }))));
const CartPage = withSuspense(lazy(() => import("./pages/CartPage").then(m => ({ default: m.CartPage }))));
const CheckoutPage = withSuspense(lazy(() => import("./pages/CheckoutPage").then(m => ({ default: m.CheckoutPage }))));
const AccountPage = withSuspense(lazy(() => import("./pages/AccountPage").then(m => ({ default: m.AccountPage }))));
const OrdersPage = withSuspense(lazy(() => import("./pages/OrdersPage").then(m => ({ default: m.OrdersPage }))));
const WishlistPage = withSuspense(lazy(() => import("./pages/WishlistPage").then(m => ({ default: m.WishlistPage }))));
const LoginPage = withSuspense(lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage }))));
const AboutPage = withSuspense(lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage }))));
const ContactPage = withSuspense(lazy(() => import("./pages/ContactPage").then(m => ({ default: m.ContactPage }))));
const PoliciesPage = withSuspense(lazy(() => import("./pages/PoliciesPage").then(m => ({ default: m.PoliciesPage }))));

// Lazy load all heavy Admin pages
const AdminDashboard = withSuspense(lazy(() => import("./pages/admin/AdminDashboard").then(m => ({ default: m.AdminDashboard }))));
const AdminProducts = withSuspense(lazy(() => import("./pages/admin/AdminProducts").then(m => ({ default: m.AdminProducts }))));
const AdminInventory = withSuspense(lazy(() => import("./pages/admin/AdminInventory").then(m => ({ default: m.AdminInventory }))));
const AdminProductDetail = withSuspense(lazy(() => import("./pages/admin/AdminProductDetail").then(m => ({ default: m.AdminProductDetail }))));
const AdminCategories = withSuspense(lazy(() => import("./pages/admin/AdminCategories").then(m => ({ default: m.AdminCategories }))));
const AdminOrders = withSuspense(lazy(() => import("./pages/admin/AdminOrders").then(m => ({ default: m.AdminOrders }))));
const AdminDeliveries = withSuspense(lazy(() => import("./pages/admin/AdminDeliveries").then(m => ({ default: m.AdminDeliveries }))));
const AdminCustomers = withSuspense(lazy(() => import("./pages/admin/AdminCustomers").then(m => ({ default: m.AdminCustomers }))));
const AdminPromotions = withSuspense(lazy(() => import("./pages/admin/AdminPromotions").then(m => ({ default: m.AdminPromotions }))));
const AdminStats = withSuspense(lazy(() => import("./pages/admin/AdminStats").then(m => ({ default: m.AdminStats }))));
const AdminChats = withSuspense(lazy(() => import("./pages/admin/AdminChats").then(m => ({ default: m.AdminChats }))));
const AdminBanners = withSuspense(lazy(() => import("./pages/admin/AdminBanners").then(m => ({ default: m.AdminBanners }))));
const AdminStaff = withSuspense(lazy(() => import("./pages/admin/AdminStaff").then(m => ({ default: m.AdminStaff }))));
const AdminNotifications = withSuspense(lazy(() => import("./pages/admin/AdminNotifications").then(m => ({ default: m.AdminNotifications }))));
const AdminShippingSettings = withSuspense(lazy(() => import("./pages/admin/AdminShippingSettings").then(m => ({ default: m.AdminShippingSettings }))));
const AdminReviews = withSuspense(lazy(() => import("./pages/admin/AdminReviews").then(m => ({ default: m.AdminReviews }))));
const AdminTransactions = withSuspense(lazy(() => import("./pages/admin/AdminTransactions").then(m => ({ default: m.AdminTransactions }))));
const AdminBrands = withSuspense(lazy(() => import("./pages/admin/AdminBrands").then(m => ({ default: m.AdminBrands }))));
const AdminTopics = withSuspense(lazy(() => import("./pages/admin/AdminTopics").then(m => ({ default: m.AdminTopics }))));
const AdminArticles = withSuspense(lazy(() => import("./pages/admin/AdminArticles").then(m => ({ default: m.AdminArticles }))));
const AdminWarranties = withSuspense(lazy(() => import("./pages/admin/AdminWarranties").then(m => ({ default: m.AdminWarranties }))));
const AdminSecurity = withSuspense(lazy(() => import("./pages/admin/AdminSecurity").then(m => ({ default: m.AdminSecurity }))));
const AdminCRM = withSuspense(lazy(() => import("./pages/admin/AdminCRM").then(m => ({ default: m.AdminCRM }))));
const AdminSiteSettings = withSuspense(lazy(() => import("./pages/admin/AdminSiteSettings").then(m => ({ default: m.AdminSiteSettings }))));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, Component: HomePage },
      { path: "products", Component: ProductsPage },
      { path: "products/:id", Component: ProductDetailPage },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "account", Component: AccountPage },
      { path: "orders", Component: OrdersPage },
      { path: "wishlist", Component: WishlistPage },
      { path: "login", Component: LoginPage },
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },
      { path: "policies", Component: PoliciesPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "products", Component: AdminProducts },
      { path: "inventory", Component: AdminInventory },
      { path: "products/:id", Component: AdminProductDetail },
      { path: "brands", Component: AdminBrands },
      { path: "categories", Component: AdminCategories },
      { path: "topics", Component: AdminTopics },
      { path: "articles", Component: AdminArticles },
      { path: "orders", Component: AdminOrders },
      { path: "deliveries", Component: AdminDeliveries },
      { path: "transactions", Component: AdminTransactions },
      { path: "customers", Component: AdminCustomers },
      { path: "promotions", Component: AdminPromotions },
      { path: "stats", Component: AdminStats },
      { path: "chats", Component: AdminChats },
      { path: "banners", Component: AdminBanners },
      { path: "staff", Component: AdminStaff },
      { path: "notifications", Component: AdminNotifications },
      { path: "reviews", Component: AdminReviews },
      { path: "warranties", Component: AdminWarranties },
      { path: "security", Component: AdminSecurity },
      { path: "crm", Component: AdminCRM },
      { path: "shipping-settings", Component: AdminShippingSettings },
      { path: "site-settings", Component: AdminSiteSettings },
    ],
  },
]);
