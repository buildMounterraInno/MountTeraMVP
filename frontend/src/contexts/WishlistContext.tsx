import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  WishlistItem,
  fetchWishlistItems,
  addToWishlist,
  removeFromWishlist
} from '../lib/supabase';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  loading: boolean;
  error: string | null;
  addItemToWishlist: (item: Omit<WishlistItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  removeItemFromWishlist: (itemId: string, itemType: 'event' | 'experience') => Promise<void>;
  isInWishlist: (itemId: string, itemType: 'event' | 'experience') => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refreshWishlist = async () => {
    if (!user?.id) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const items = await fetchWishlistItems(user.id);
      setWishlistItems(items);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addItemToWishlist = async (item: Omit<WishlistItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const newItem = await addToWishlist({
        ...item,
        user_id: user.id
      });
      setWishlistItems(prev => [newItem, ...prev]);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      throw err;
    }
  };

  const removeItemFromWishlist = async (itemId: string, itemType: 'event' | 'experience') => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      await removeFromWishlist(user.id, itemId, itemType);
      setWishlistItems(prev => prev.filter(
        item => !(item.item_id === itemId && item.item_type === itemType)
      ));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      throw err;
    }
  };

  const isInWishlist = (itemId: string, itemType: 'event' | 'experience') => {
    return wishlistItems.some(
      item => item.item_id === itemId && item.item_type === itemType
    );
  };

  // Load wishlist when user changes
  useEffect(() => {
    refreshWishlist();
  }, [user?.id]);

  const value: WishlistContextType = {
    wishlistItems,
    loading,
    error,
    addItemToWishlist,
    removeItemFromWishlist,
    isInWishlist,
    refreshWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};