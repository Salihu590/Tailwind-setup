// CheckoutGuard.jsx — blocks empty-bag / skipped-step checkout access
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * requireItems    → cart must have ≥ 1 item
 * requireShipping → sessionStorage must contain manwe_shipping
 *
 * Shipping payload is written by ShippingOptions.jsx on continue.
 * Shape example: { method: "express", price: 5000, label: "..." }
 */
export default function CheckoutGuard({
  requireItems = false,
  requireShipping = false,
}) {
  const { cartItems } = useCart();
  const location = useLocation();

  const itemCount = (cartItems || []).reduce(
    (n, item) => n + (item.quantity || 1),
    0
  );

  if (requireItems && itemCount === 0) {
    // Send them to bag, preserve where they tried to go
    return (
      <Navigate
        to="/cart"
        replace
        state={{ from: location.pathname, reason: "empty_bag" }}
      />
    );
  }

  if (requireShipping) {
    let shipping = null;
    try {
      const raw = sessionStorage.getItem("manwe_shipping");
      shipping = raw ? JSON.parse(raw) : null;
    } catch {
      shipping = null;
    }

    if (!shipping?.method) {
      return (
        <Navigate
          to="/checkout/shipping"
          replace
          state={{ from: location.pathname, reason: "missing_shipping" }}
        />
      );
    }
  }

  return <Outlet />;
}