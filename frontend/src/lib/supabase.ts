import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('Available env vars:', import.meta.env);
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