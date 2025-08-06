import { supabase, Article } from './supabase';

// Fetch all published articles
export async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Fetch single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Fetch articles by category
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles by category:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}

// Fetch featured articles (latest)
export async function getFeaturedArticles(limit: number = 3): Promise<Article[]> {
  try {
    console.log('Querying Supabase articles table...');
    
    // Step 1: Try without any filters first
    console.log('Step 1: Getting all articles without filters...');
    const { data: allData, error: allError } = await supabase
      .from('articles')
      .select('*')
      .limit(limit);

    console.log('All articles result:', { data: allData, error: allError });

    // Step 2: Try with published filter
    console.log('Step 2: Getting published articles...');
    const { data: publishedData, error: publishedError } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .limit(limit);

    console.log('Published articles result:', { data: publishedData, error: publishedError });

    // Step 3: Try with ordering (if published filter worked)
    if (!publishedError && publishedData && publishedData.length > 0) {
      console.log('Step 3: Getting published articles with ordering...');
      const { data: orderedData, error: orderedError } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      console.log('Ordered articles result:', { data: orderedData, error: orderedError });

      if (orderedError) {
        console.log('Ordering failed, returning published articles without ordering');
        return publishedData;
      }
      
      return orderedData || [];
    }

    // If published filter failed, return all articles
    if (allData && allData.length > 0) {
      console.log('Published filter failed, returning all articles');
      return allData;
    }

    console.log('No articles found');
    return [];
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    throw error;
  }
}

// Debug function to test basic connection
export async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // First try 'articles' table
    console.log('Trying table name: articles');
    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .limit(1);

    console.log('Articles table result:', { data: articlesData, error: articlesError });

    if (articlesError) {
      // If 'articles' fails, try 'article' (singular)
      console.log('Articles table failed, trying table name: article');
      const { data: articleData, error: articleError } = await supabase
        .from('article')
        .select('*')
        .limit(1);

      console.log('Article table result:', { data: articleData, error: articleError });
      
      return { 
        success: !articleError, 
        data: articleData, 
        error: articleError,
        tableName: articleError ? 'neither articles nor article work' : 'article'
      };
    }

    return { 
      success: true, 
      data: articlesData, 
      error: null,
      tableName: 'articles'
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error, tableName: 'unknown' };
  }
}

// Get all categories
export async function getCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('category')
      .eq('published', true);

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    // Get unique categories
    const categories = [...new Set(data?.map(article => article.category) || [])];
    return categories.filter(Boolean);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Search articles by title or content
export async function searchArticles(searchTerm: string): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error searching articles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}