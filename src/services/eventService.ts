import { api } from './api';

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description?: string;
  image_url?: string;
  category: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  organizer: string;
  start_date: string;
  end_date: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  registration_link?: string;
  max_participants?: number;
  current_participants?: number;
  is_featured: boolean;
  is_free: boolean;
  registration_fee?: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface GetEventsResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface GetEventsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
  date_from?: string;
  date_to?: string;
}

export const eventService = {
  async getEvents(params?: GetEventsParams): Promise<GetEventsResponse> {
    const response = await api.get<GetEventsResponse>('/events', params);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch events');
  },

  async getEventBySlug(slug: string): Promise<Event> {
    const response = await api.get<{ event: Event }>(`/events/${slug}`);
    if (response.success && response.data?.event) {
      return response.data.event;
    }
    throw new Error(response.message || 'Failed to fetch event');
  },

  async getCategories(): Promise<EventCategory[]> {
    const response = await api.get<{ categories: EventCategory[] }>('/events/categories/all');
    if (response.success && response.data?.categories) {
      return response.data.categories;
    }
    throw new Error(response.message || 'Failed to fetch event categories');
  },

  // Admin functions
  async createEvent(eventData: Omit<Event, 'id' | 'slug' | 'view_count' | 'created_at' | 'updated_at' | 'category_name' | 'category_color' | 'category_icon'>): Promise<Event> {
    const response = await api.post<{ event: Event }>('/events', eventData);
    if (response.success && response.data?.event) {
      return response.data.event;
    }
    throw new Error(response.message || 'Failed to create event');
  },
};
