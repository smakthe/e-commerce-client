import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load and merge cart when user logs in
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      let parsedCart: CartItem[] = [];
      if (savedCart) {
        try {
          parsedCart = JSON.parse(savedCart) as CartItem[];
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }

      setItems((prev) => {
        const merged = [...parsedCart];
        prev.forEach(pItem => {
           const existing = merged.find(m => m.productId === pItem.productId);
           if (existing) existing.quantity += pItem.quantity;
           else merged.push(pItem);
        });
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(merged));
        return merged;
      });
    } else {
      setItems([]);
    }
  }, [user?.id]);

  const saveCart = (newItems: CartItem[]) => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(newItems));
    }
  };

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      let newItems;
      const existing = prev.find((item) => item.productId === newItem.productId);
      if (existing) {
        newItems = prev.map((item) => 
          item.productId === newItem.productId 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        newItems = [...prev, newItem];
      }
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) => {
      const newItems = prev.map((item) => item.productId === productId ? { ...item, quantity } : item);
      saveCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.productId !== productId);
      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
