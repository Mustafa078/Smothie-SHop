import { createContext, useState } from "react";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct !== undefined) {
      setCart(
        cart.map((item) => {
          return item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        }),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };
  const updateQuantity = (id, newQuantity) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };
  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
