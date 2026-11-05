import { createContext } from 'react';

export type CartItem = {
  productId: string;
  color: string;
  quantity: number;
};

export type Toast = {
  id: number;
  message: string;
  tone: 'success' | 'info' | 'error';
};

export type ShopContextValue = {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  wishlist: string[];
  compare: string[];
  toasts: Toast[];
  addToCart: (productId: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  notify: (message: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;
};

export const ShopContext = createContext<ShopContextValue | null>(null);
