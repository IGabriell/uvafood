import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Entregue' | 'Em preparo' | 'A caminho';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  orderHistory: Order[];
  lastOrder: Order | null;
  checkout: (totalOverride?: number) => void;
  clearLastOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('uvafood_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    const saved = localStorage.getItem('uvafood_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('uvafood_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('uvafood_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  const addToCart = (product: Product) => {
    setItems(curr => {
      const existing = curr.find(i => i.id === product.id);
      if (existing) {
        return curr.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...curr, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(curr => curr.filter(i => i.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setItems(curr => curr.map(i => i.id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const checkout = (totalOverride?: number) => {
    if (items.length === 0) return;
    const statuses: Order['status'][] = ['Entregue', 'Em preparo', 'A caminho'];
    const order: Order = {
      id: `#${String(Date.now()).slice(-6)}`,
      items: [...items],
      total: totalOverride ?? items.reduce((s, i) => s + i.price * i.quantity, 0),
      date: new Date().toLocaleString('pt-BR'),
      status: 'Em preparo',
    };
    setOrderHistory(prev => [order, ...prev]);
    setLastOrder(order);
    clearCart();
  };

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const clearLastOrder = () => setLastOrder(null);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, orderHistory, lastOrder, checkout, clearLastOrder
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de um CartProvider');
  return ctx;
}
