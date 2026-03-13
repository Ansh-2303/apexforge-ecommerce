import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import PaymentPage from "./pages/PaymentPage";
import AddressPage from "./pages/AddressPage";
import CategoryProducts from "./pages/CategoryProducts";
import { Toaster } from "react-hot-toast";
import Wishlist from "./pages/Wishlist"

function App() {
  return (
    <>
   <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
    style: {
      background: "#0f172a",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.08)",
      padding: "12px 16px",
      borderRadius: "10px",
      fontSize: "14px"
    },
    success: {
      iconTheme: {
        primary: "#10b981",
        secondary: "#0f172a"
      }
    },
    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#0f172a"
      }
    }
  }}
/>

      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetails />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <AddressPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/:id"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/category/:categoryName"
            element={<CategoryProducts />}
          />

          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;