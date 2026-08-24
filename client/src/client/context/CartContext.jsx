// CartContext.jsx — MANWE Global State (Production Hardened)
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CART_STORAGE_KEY = "manwe_cartItems";
const CHECKOUT_STORAGE_KEY = "manwe_checkoutData";
const INSTRUCTIONS_STORAGE_KEY = "manwe_specialInstructions";
const DELIVERY_COST_KEY = "manwe_deliveryCost";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Safe parsing helper
  const getLocalStorageItem = (key, defaultValue) => {
    try {
      if (typeof window === "undefined") return defaultValue;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.warn(`MANWE STORE: Failed to parse ${key}`, error);
      return defaultValue;
    }
  };

  const [cartItems, setCartItems] = useState(() =>
    getLocalStorageItem(CART_STORAGE_KEY, [])
  );
  
  const [checkoutData, setCheckoutData] = useState(() =>
    getLocalStorageItem(CHECKOUT_STORAGE_KEY, {})
  );

  const [specialInstructions, setSpecialInstructions] = useState(() =>
    getLocalStorageItem(INSTRUCTIONS_STORAGE_KEY, "")
  );

  const [deliveryCost, setDeliveryCost] = useState(() =>
    getLocalStorageItem(DELIVERY_COST_KEY, 0)
  );

  // Sync state to LocalStorage securely
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutData));
      localStorage.setItem(INSTRUCTIONS_STORAGE_KEY, JSON.stringify(specialInstructions));
      localStorage.setItem(DELIVERY_COST_KEY, JSON.stringify(deliveryCost));
    } catch (error) {
      console.error("MANWE STORE: Storage quota exceeded or unavailable.", error);
    }
  }, [cartItems, checkoutData, specialInstructions, deliveryCost]);

  // Cross-tab synchronization (updates cart if modified in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CART_STORAGE_KEY) {
        setCartItems(e.newValue ? JSON.parse(e.newValue) : []);
      }
      if (e.key === INSTRUCTIONS_STORAGE_KEY) {
        setSpecialInstructions(e.newValue ? JSON.parse(e.newValue) : "");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.id === product.id && item.size === product.size
      );

      if (existingItemIndex > -1) {
        return prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: Math.min(20, item.quantity + 1) } // Security: Cap at 20
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.size === size))
    );
  }, []);

  const updateQuantity = useCallback((id, size, newQuantity) => {
    // Security: Prevents negative values and ridiculous numbers
    if (newQuantity < 1) return;
    const safeQuantity = Math.min(20, newQuantity);

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: safeQuantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSpecialInstructions("");
    setDeliveryCost(0);
  }, []);

  const updateCheckoutData = useCallback((data) => {
    setCheckoutData(data);
  }, []);

  const updateSpecialInstructions = useCallback((instructions) => {
    // Security: Stop payload bloating
    setSpecialInstructions(String(instructions).slice(0, 300));
  }, []);

  const updateDeliveryCost = useCallback((cost) => {
    setDeliveryCost(Number(cost) || 0);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkoutData,
        updateCheckoutData,
        specialInstructions,
        updateSpecialInstructions,
        deliveryCost,
        updateDeliveryCost,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);