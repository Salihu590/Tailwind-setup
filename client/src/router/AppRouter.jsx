// AppRouter.jsx — MANWE (Security + Performance hardened)
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// ─── Eager: tiny shell pieces needed immediately ─────────────────────────────
import Layout from "../client/layouts/Layout";
import AdminGuard from "../admin/guards/AdminGuard";
import CheckoutGuard from "../client/guards/CheckoutGuard";

// ─── Lazy: client pages (code-split) ─────────────────────────────────────────
const Landing = lazy(() => import("../client/pages/Landing"));
const Shop = lazy(() => import("../client/pages/Shop"));
const Product = lazy(() => import("../client/pages/Product"));
const Cart = lazy(() => import("../client/pages/Cart"));
const Checkout = lazy(() => import("../client/pages/Checkout"));
const ShippingOptions = lazy(() => import("../client/pages/ShippingOptions"));
const Payment = lazy(() => import("../client/pages/Payment"));
const Contact = lazy(() => import("../client/pages/Contact"));
const Terms = lazy(() => import("../client/pages/Terms"));
const NotFound = lazy(() => import("../client/pages/NotFound"));

// ─── Lazy: admin pages (NEVER in the public initial bundle) ──────────────────
const AdminLayout = lazy(() => import("../admin/layouts/AdminLayout"));
const Login = lazy(() => import("../admin/pages/Login"));
const ResetPassword = lazy(() => import("../admin/pages/ResetPassword"));
const Revenue = lazy(() => import("../admin/pages/Revenue"));
const Orders = lazy(() => import("../admin/pages/Orders"));
const Customers = lazy(() => import("../admin/pages/Customers"));
const TopProducts = lazy(() => import("../admin/pages/TopProducts"));
const Newsletter = lazy(() => import("../admin/pages/Newsletter"));

// ─── Route-level loading fallback ────────────────────────────────────────────
function RouteLoader() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center gap-6 bg-[#080808]"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 border border-[#1A5C2A]/40 manwe-spin" />
        <div className="absolute inset-3 border border-[#C4541A]/30 rotate-45 manwe-spin-reverse" />
      </div>
      <p
        className="text-[#E8E3D8]/50"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "18px",
          letterSpacing: "0.35em",
        }}
      >
        MANWE
      </p>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

// Scroll to top on every navigation
function ScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  // Imperative: runs on pathname change without extra deps noise
  if (typeof window !== "undefined") {
    // defer to next paint so layout is ready
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
    });
  }
  return null;
}

export default function AppRouter() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <ScrollToTopOnNavigate />
      <Routes>
        {/* ════════════ PUBLIC ════════════ */}
        <Route path="/" element={<Landing />} />

        <Route element={<Layout />}>
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />

          {/* Checkout funnel — bag must not be empty */}
          <Route element={<CheckoutGuard requireItems />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/shipping" element={<ShippingOptions />} />

            {/* Payment — also needs shipping selection in session */}
            <Route element={<CheckoutGuard requireItems requireShipping />}>
              <Route path="/checkout/payment" element={<Payment />} />
            </Route>
          </Route>
        </Route>

        {/* ════════════ ADMIN (public auth screens) ════════════ */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        {/* ════════════ ADMIN (protected) ════════════ */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Revenue />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="topproducts" element={<TopProducts />} />
          <Route path="newsletter" element={<Newsletter />} />
          {/* Unknown admin sub-routes → dashboard, not public home */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* ════════════ 404 ════════════ */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}