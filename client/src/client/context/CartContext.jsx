import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CART_STORAGE_KEY = "cartItems";
const CHECKOUT_STORAGE_KEY = "checkoutData";
const INSTRUCTIONS_STORAGE_KEY = "specialInstructions";

const CartContext = createContext();

export function CartProvider({ children }) {
  const getLocalStorageItem = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error("Failed to parse localStorage data:", error);
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

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(checkoutData));
      localStorage.setItem(
        INSTRUCTIONS_STORAGE_KEY,
        JSON.stringify(specialInstructions)
      );
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, [cartItems, checkoutData, specialInstructions]);
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.id === product.id && item.size === product.size
      );

      if (existingItemIndex > -1) {
        return prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
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
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSpecialInstructions("");
  }, []);

  const updateCheckoutData = useCallback((data) => {
    setCheckoutData(data);
  }, []);

  const updateSpecialInstructions = useCallback((instructions) => {
    setSpecialInstructions(instructions);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
