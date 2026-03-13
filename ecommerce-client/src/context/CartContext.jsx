import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Fetch Cart
  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      const { data } = await api.get("/cart");
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Cart fetch error", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add To Cart
  const addToCart = async ({ productId, variantId, quantity }) => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const { data } = await api.post("/cart", {
        productId,
        variantId,
        quantity,
      });

      setCartItems(data.items);
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to add item to cart"
      );
    }
  };

  // Remove Item
  const removeFromCart = async (productId, variantId) => {
    try {
      const { data } = await api.delete("/cart", {
        data: { productId, variantId },
      });

      setCartItems(data.items);
    } catch (error) {
      console.error("Remove cart item error", error);
    }
  };

  // Update Quantity
  const updateQuantity = async (productId, variantId, newQty) => {
    if (newQty < 1) return;

    try {
      const { data } = await api.put("/cart", {
        productId,
        variantId,
        quantity: newQty,
      });

      setCartItems(data.items);
    } catch (error) {
      console.error("Update cart error", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);