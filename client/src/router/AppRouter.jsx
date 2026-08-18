// AppRouter.jsx

import { Routes, Route, Navigate } from 'react-router-dom'

// Client
import Layout from '../client/layouts/Layout'
import Landing from '../client/pages/Landing'
import Shop from '../client/pages/Shop'
import Product from '../client/pages/Product'
import Cart from '../client/pages/Cart'
import Checkout from '../client/pages/Checkout'
import ShippingOptions from '../client/pages/ShippingOptions'
import Payment from '../client/pages/Payment'
import Contact from '../client/pages/Contact'
import Terms from '../client/pages/Terms'

// Admin
import AdminGuard from '../admin/guards/AdminGuard'
import AdminLayout from '../admin/layouts/AdminLayout'
import Login from '../admin/pages/Login'
import ResetPassword from '../admin/pages/ResetPassword'  // ← NEW
import Revenue from '../admin/pages/Revenue'
import Orders from '../admin/pages/Orders'
import Customers from '../admin/pages/Customers'
import TopProducts from '../admin/pages/TopProducts'
import Newsletter from '../admin/pages/Newsletter'

export default function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />

      <Route element={<Layout />}>
        <Route path='/shop' element={<Shop />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/checkout/shipping' element={<ShippingOptions />} />
        <Route path='/checkout/payment' element={<Payment />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/terms' element={<Terms />} />
      </Route>

      {/* ADMIN */}
      <Route path='/admin/login' element={<Login />} />
      <Route path='/admin/reset-password' element={<ResetPassword />} />

      <Route
        path='/admin'
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<Revenue />} />
        <Route path='orders' element={<Orders />} />
        <Route path='customers' element={<Customers />} />
        <Route path='topproducts' element={<TopProducts />} />
        <Route path='newsletter' element={<Newsletter />} />
      </Route>

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}