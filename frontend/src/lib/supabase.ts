import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || 'fallback-url', 
  supabaseAnonKey || 'fallback-key'
);

export interface Article {
  slug: string; // Primary key
  title: string;
  content: string;
  excerpt: string;
  image_url?: string;
  category: string;
  published: boolean;
  published_at: string;
  tags: string[];
  author: string;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  testimonial: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string; // References auth.users table directly
  item_type: 'event' | 'experience';
  item_id: string; // The event or experience ID
  item_name: string; // Cached for display
  item_image_url?: string; // Cached for display
  item_location: string; // Cached for display
  item_price?: number; // Cached for display
  created_at: string;
  updated_at: string;
}

// Fetch all testimonials
export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }

  return data || [];
};


// Add new testimonial
export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> => {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonial])
    .select()
    .single();

  if (error) {
    console.error('Error adding testimonial:', error);
    throw error;
  }

  return data;
};

// Wishlist Functions
export const fetchWishlistItems = async (userId: string): Promise<WishlistItem[]> => {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlist items:', error);
    throw error;
  }

  return data || [];
};

export const addToWishlist = async (wishlistItem: Omit<WishlistItem, 'id' | 'created_at' | 'updated_at'>): Promise<WishlistItem> => {
  console.log('Adding to wishlist with data:', wishlistItem);

  const { data, error } = await supabase
    .from('wishlist')
    .insert([wishlistItem])
    .select()
    .single();

  if (error) {
    console.error('Error adding to wishlist:', error);
    console.error('Attempted data:', wishlistItem);
    throw error;
  }

  return data;
};

export const removeFromWishlist = async (userId: string, itemId: string, itemType: 'event' | 'experience'): Promise<void> => {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .eq('item_type', itemType);

  if (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const checkWishlistStatus = async (userId: string, itemId: string, itemType: 'event' | 'experience'): Promise<boolean> => {
  const { data, error } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .eq('item_type', itemType)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking wishlist status:', error);
    throw error;
  }

  return !!data;
};