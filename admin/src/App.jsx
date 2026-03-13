import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CategoryList from "./pages/CategoryList";

import ProductList from "./pages/ProductList";
import ProductEdit from "./pages/ProductEdit";
import ProductForm from "./pages/ProductForm";

import OrderList from "./pages/OrderList";

import CouponList from "./pages/CouponList";
import CreateCoupon from "./pages/CreateCoupon";

import CustomerList from "./pages/CustomerList";

import AdminRoute from "./components/AdminRoute";
import Analytics from "./pages/Analytics"

function App() {
  return (
    <Routes>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/admin/login" />} />

      {/* Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      {/* Categories */}
      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <CategoryList />
          </AdminRoute>
        }
      />

      {/* Products */}
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <ProductList />
          </AdminRoute>
        }
      />

      {/* Add Product */}
      <Route
        path="/admin/products/new"
        element={
          <AdminRoute>
            <ProductForm />
          </AdminRoute>
        }
      />

      {/* Edit Product */}
      <Route
        path="/admin/products/edit/:id"
        element={
          <AdminRoute>
            <ProductEdit />
          </AdminRoute>
        }
      />

      {/* Orders */}
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <OrderList />
          </AdminRoute>
        }
      />

      {/* Coupons */}
      <Route
        path="/admin/coupons"
        element={
          <AdminRoute>
            <CouponList />
          </AdminRoute>
        }
      />

      {/* Create Coupon */}
      <Route
        path="/admin/coupons/create"
        element={
          <AdminRoute>
            <CreateCoupon />
          </AdminRoute>
        }
      />

      {/* Customers */}
      <Route
        path="/admin/customers"
        element={
          <AdminRoute>
            <CustomerList />
          </AdminRoute>
        }
      />

      <Route path="/admin/analytics" element={<Analytics />} />

    </Routes>
  );
}

export default App;