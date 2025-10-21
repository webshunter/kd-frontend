import { api } from './api';

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  topic_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  slug: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  is_featured: boolean;
  view_count: number;
  reply_count: number;
  last_reply_at?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Joined fields
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  category_icon?: string;
  author_name?: string;
  author_role?: string;
  last_reply_author_name?: string;
}

export interface ForumReply {
  id: string;
  content: string;
  is_solution: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
  parent_reply_id?: string;
  // Joined fields
  author_name?: string;
  author_role?: string;
  author_email?: string;
}

interface GetTopicsResponse {
  topics: ForumTopic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface GetRepliesResponse {
  replies: ForumReply[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface GetTopicsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  pinned?: boolean;
  featured?: boolean;
  status?: 'active' | 'archived' | 'deleted';
  sort?: 'last_reply_at' | 'created_at' | 'view_count';
}

export const forumService = {
  async getTopics(params?: GetTopicsParams): Promise<GetTopicsResponse> {
    const response = await api.get<GetTopicsResponse>('/forum/topics', params);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch forum topics');
  },

  async getTopicBySlug(slug: string): Promise<ForumTopic> {
    const response = await api.get<{ topic: ForumTopic }>(`/forum/topics/${slug}`);
    if (response.success && response.data?.topic) {
      return response.data.topic;
    }
    throw new Error(response.message || 'Failed to fetch forum topic');
  },

  async getReplies(slug: string, params?: { page?: number; limit?: number }): Promise<GetRepliesResponse> {
    const response = await api.get<GetRepliesResponse>(`/forum/topics/${slug}/replies`, params);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch forum replies');
  },

  async getCategories(): Promise<ForumCategory[]> {
    const response = await api.get<{ categories: ForumCategory[] }>('/forum/categories');
    if (response.success && response.data?.categories) {
      return response.data.categories;
    }
    throw new Error(response.message || 'Failed to fetch forum categories');
  },

  // Authenticated functions
  async createTopic(topicData: {
    title: string;
    content: string;
    category_id: string;
    tags?: string[];
  }): Promise<ForumTopic> {
    const response = await api.post<{ topic: ForumTopic }>('/forum/topics', topicData);
    if (response.success && response.data?.topic) {
      return response.data.topic;
    }
    throw new Error(response.message || 'Failed to create forum topic');
  },

  async createReply(slug: string, replyData: {
    content: string;
    parent_reply_id?: string;
  }): Promise<ForumReply> {
    const response = await api.post<{ reply: ForumReply }>(`/forum/topics/${slug}/replies`, replyData);
    if (response.success && response.data?.reply) {
      return response.data.reply;
    }
    throw new Error(response.message || 'Failed to create forum reply');
  },
};
