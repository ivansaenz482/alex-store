"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
  image?: string;
  categoryName?: string;
  size?: string;
  qty: number;
}

export interface NewCartItem {
  productId: string;
  name: string;
  price: number;
  currency: string;
  image?: string;
  categoryName?: string;
  size?: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  currency: string;
  ready: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  add: (item: NewCartItem, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "alex-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
        }
      } catch {
        // sin localStorage
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // sin localStorage
    }
  }, [items, ready]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const add = useCallback((item: NewCartItem, qty = 1) => {
    const id = `${item.productId}::${item.size ?? ""}`;
    setItems((prev) => {
      const index = prev.findIndex((entry) => entry.id === id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = { ...copy[index], qty: copy[index].qty + qty };
        return copy;
      }
      return [...prev, { ...item, id, qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((entry) => (entry.id === id ? { ...entry, qty: Math.max(0, qty) } : entry))
        .filter((entry) => entry.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, entry) => sum + entry.qty, 0);
    const subtotal = items.reduce((sum, entry) => sum + entry.qty * entry.price, 0);
    const currency = items[0]?.currency ?? "$";
    return {
      items,
      count,
      subtotal,
      currency,
      ready,
      open,
      setOpen,
      add,
      remove,
      setQty,
      clear,
    };
  }, [items, ready, open, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return context;
}
