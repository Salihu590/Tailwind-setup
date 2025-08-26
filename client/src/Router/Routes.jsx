import Layout from "../Layout/Layout";
import Shop from "../pages/Shop";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ShippingOptions from "../pages/ShippingOptions"; // Import the new component
import Terms from "../pages/Terms";
import { Routes, Route } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Shop />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout/shipping" element={<ShippingOptions />} /> {/* Add the new shipping route */}
        <Route path="terms" element={<Terms />} />
      </Route>
    </Routes>
  );
}
