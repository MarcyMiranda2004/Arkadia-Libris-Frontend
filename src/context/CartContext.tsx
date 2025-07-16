import React, { createContext, useContext, useEffect, useState } from "react";
import ReactNode from "react";
import { AuthContext } from "../context/AuthContext";
import type { CartDto } from "../type/CartDto";

interface AddToCartRequestDto {
  productId: number;
  quantity: number;
}

interface CartContextType {
  cart: CartDto | null;
  loading: boolean;
  error: string | null;
  viewCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

interface LocalCartItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface LocalCart {
  items: LocalCartItem[];
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve essere usato all'interno di CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token, userId } = useContext(AuthContext);
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API = "http://localhost:8080";
  const headers = { Authorization: `Bearer ${token}` };

  const viewCart = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${userId}/cart`, { headers });
      if (!res.ok) throw new Error(`Errore viewCart: ${res.status}`);
      const data: CartDto = await res.json();
      setCart(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity = 1) => {
    if (!userId) return;
    setLoading(true);
    try {
      const body: AddToCartRequestDto = { productId, quantity };
      const res = await fetch(`${API}/users/${userId}/cart`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Errore addToCart: ${res.status}`);
      const data: CartDto = await res.json();
      setCart(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId: number, quantity: number) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/users/${userId}/cart/${productId}?quantity=${quantity}`,
        { method: "PATCH", headers }
      );
      if (!res.ok) throw new Error(`Errore updateItemQuantity: ${res.status}`);
      const data: CartDto = await res.json();
      setCart(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: number) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${userId}/cart/${productId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Errore removeItem: ${res.status}`);
      const data: CartDto = await res.json();
      setCart(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${userId}/cart`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Errore clearCart: ${res.status}`);
      setCart(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) viewCart();
  }, [token, userId]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        viewCart,
        addToCart,
        updateItemQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
