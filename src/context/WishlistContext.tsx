import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";
import type { WishlistDto } from "../type/WishlistDto";

interface WishlistContextType {
  wishlist: WishlistDto | null;
  loading: boolean;
  error: string | null;
  viewWishlist: () => Promise<void>;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  clearWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const useWishlist = (): WishlistContextType => {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlist deve essere usato dentro WishlistProvider");
  return ctx;
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { token, userId } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState<WishlistDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = "http://localhost:8080";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const viewWishlist = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${userId}/wishlist`, { headers });
      if (!res.ok) throw new Error(`Errore: ${res.status}`);
      const data: WishlistDto = await res.json();
      setWishlist(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: number) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${userId}/wishlist`, {
        method: "POST",
        headers,
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error(`Errore: ${res.status}`);
      const data: WishlistDto = await res.json();
      setWishlist(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${userId}/wishlist/${productId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Errore: ${res.status}`);
      const data: WishlistDto = await res.json();
      setWishlist(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${userId}/wishlist`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Errore: ${res.status}`);
      setWishlist(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userId) viewWishlist();
  }, [token, userId]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        viewWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
