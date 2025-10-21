/**
 * News Service
 * Mengelola data berita dan artikel
 */

import { api, ApiError } from './api';

// News Article interface
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  featured: boolean;
  view_count: number;
  published_at: string;
  created_at: string;
  category_name: string;
  category_slug: string;
  category_color: string;
  author_name: string;
}

// News Category interface
export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  is_active: boolean;
}

// News query parameters
export interface NewsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  status?: string;
}

// News response interface
export interface NewsResponse {
  articles: NewsArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// News Service class
class NewsService {
  private baseUrl = '/news';

  /**
   * Get all news articles with pagination and filtering
   */
  async getArticles(params: NewsQueryParams = {}): Promise<NewsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.featured !== undefined) queryParams.append('featured', params.featured.toString());
      if (params.status) queryParams.append('status', params.status);

      const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get<{ data: NewsResponse }>(url);

      if (response.success && response.data) {
        return response.data;
      }

      throw new ApiError('Failed to fetch news articles', 500);
    } catch (error) {
      console.error('Get news articles error:', error);
      throw error;
    }
  }

  /**
   * Get single news article by slug
   */
  async getArticleBySlug(slug: string): Promise<NewsArticle> {
    try {
      const response = await api.get<{ data: { article: NewsArticle } }>(`${this.baseUrl}/${slug}`);

      if (response.success && response.data) {
        return response.data.article;
      }

      throw new ApiError('Article not found', 404);
    } catch (error) {
      console.error('Get news article error:', error);
      throw error;
    }
  }

  /**
   * Get news categories
   */
  async getCategories(): Promise<NewsCategory[]> {
    try {
      const response = await api.get<{ data: { categories: NewsCategory[] } }>(`${this.baseUrl}/categories/all`);

      if (response.success && response.data) {
        return response.data.categories;
      }

      throw new ApiError('Failed to fetch news categories', 500);
    } catch (error) {
      console.error('Get news categories error:', error);
      throw error;
    }
  }

  /**
   * Get featured articles
   */
  async getFeaturedArticles(limit: number = 3): Promise<NewsArticle[]> {
    try {
      const response = await this.getArticles({ featured: true, limit });
      return response.articles;
    } catch (error) {
      console.error('Get featured articles error:', error);
      throw error;
    }
  }

  /**
   * Get latest articles
   */
  async getLatestArticles(limit: number = 6): Promise<NewsArticle[]> {
    try {
      const response = await this.getArticles({ limit });
      return response.articles;
    } catch (error) {
      console.error('Get latest articles error:', error);
      throw error;
    }
  }

  /**
   * Search articles
   */
  async searchArticles(query: string, limit: number = 10): Promise<NewsArticle[]> {
    try {
      const response = await this.getArticles({ search: query, limit });
      return response.articles;
    } catch (error) {
      console.error('Search articles error:', error);
      throw error;
    }
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(categorySlug: string, limit: number = 10): Promise<NewsArticle[]> {
    try {
      const response = await this.getArticles({ category: categorySlug, limit });
      return response.articles;
    } catch (error) {
      console.error('Get articles by category error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const newsService = new NewsService();
export default newsService;
