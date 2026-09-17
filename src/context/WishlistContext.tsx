'use client';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '@/lib/mockData';

interface WishlistState {
  items: Product[];
}

type WishlistAction =
  | { type: 'TOGGLE_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string };

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'TOGGLE_ITEM': {
      const exists = state.items.find(i => i.id === action.product.id);
      return exists
        ? { items: state.items.filter(i => i.id !== action.product.id) }
        : { items: [...state.items, action.product] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.id !== action.productId) };
    default:
      return state;
  }
};

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
  isWishlisted: (id: string) => boolean;
} | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });
  const isWishlisted = (id: string) => state.items.some(i => i.id === id);
  return (
    <WishlistContext.Provider value={{ state, dispatch, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};