import Layout from "../Layout/Layout";
import Shop from "../pages/Shop";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ShippingOptions from "../pages/ShippingOptions";
import Payment from "../pages/Payment"; 
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
        <Route path="checkout/shipping" element={<ShippingOptions />} />
        <Route path="checkout/payment" element={<Payment />} /> 
        <Route path="terms" element={<Terms />} />
      </Route>
    </Routes>
  );
}
