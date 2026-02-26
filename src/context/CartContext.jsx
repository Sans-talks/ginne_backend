import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  // Normalize data from backend to match frontend expectations
  const normalizeCart = (items) => {
    return (items || []).map(item => ({
      ...item.product, // Spread product details (name, price, image, etc.)
      _id: item.product?._id, // Ensure _id is correctly set
      itemId: item._id, // Keep the cart item ID for updates/deletes
      quantity: item.quantity
    }));
  };

  const fetchCart = async () => {
    if (!token) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch("https://ginne-backend.onrender.com/api/cart", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setCart(normalizeCart(data.items));
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  // Fetch cart on mount and when token might have changed
  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (product, qty = 1) => {
    if (!token) return alert("Please login to add items to cart");

    try {
      const response = await fetch("https://ginne-backend.onrender.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id || product.id, qty })
      });

      const data = await response.json();
      if (response.ok) {
        setCart(normalizeCart(data.items));
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const updateQty = async (itemId, change) => {
    if (!token) return;

    try {
      const response = await fetch(`https://ginne-backend.onrender.com/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ change })
      });

      const data = await response.json();
      if (response.ok) {
        setCart(normalizeCart(data.items));
      }
    } catch (err) {
      console.error("Update qty error:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!token) return;

    try {
      const response = await fetch(`https://ginne-backend.onrender.com/api/cart/${itemId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) {
        setCart(normalizeCart(data.items));
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
