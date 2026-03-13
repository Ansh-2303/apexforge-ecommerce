import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import "./styles/global.css";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
<BrowserRouter>
  <AuthProvider>
    <CartProvider>
    <WishlistProvider>
  <App />
</WishlistProvider>
    </CartProvider>
  </AuthProvider>
</BrowserRouter>
);