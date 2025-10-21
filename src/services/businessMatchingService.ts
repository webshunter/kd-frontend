import { api } from './api';

export interface BusinessCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  profile_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  category_id: string;
  business_name: string;
  slug: string;
  description: string;
  business_type: 'umkm' | 'startup' | 'enterprise' | 'cooperative' | 'ngo';
  industry?: string;
  founded_year?: number;
  employee_count?: string;
  annual_revenue?: string;
  website_url?: string;
  social_media: Record<string, string>;
  contact_info: Record<string, string>;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  business_hours: Record<string, any>;
  services_offered: string[];
  target_market: string[];
  certifications: string[];
  awards: string[];
  partnerships: string[];
  looking_for: string[];
  can_provide: string[];
  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
  connection_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  owner_name?: string;
  owner_email?: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  category_icon?: string;
}

export interface BusinessConnection {
  id: string;
  requester_id: string;
  target_id: string;
  connection_type: 'partnership' | 'supplier' | 'distributor' | 'collaboration' | 'investment' | 'mentorship';
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  message?: string;
  response_message?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  other_business_name?: string;
  other_business_slug?: string;
  other_owner_name?: string;
  direction?: 'incoming' | 'outgoing';
}

interface GetProfilesResponse {
  profiles: BusinessProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface GetProfilesParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  city?: string;
  business_type?: 'umkm' | 'startup' | 'enterprise' | 'cooperative' | 'ngo';
  industry?: string;
  verified?: boolean;
  featured?: boolean;
  sort?: 'created_at' | 'name' | 'verified' | 'featured';
}

interface CreateProfilePayload {
  business_name: string;
  slug: string;
  description: string;
  category_id: string;
  business_type?: 'umkm' | 'startup' | 'enterprise' | 'cooperative' | 'ngo';
  industry?: string;
  founded_year?: number;
  employee_count?: string;
  annual_revenue?: string;
  website_url?: string;
  social_media?: Record<string, string>;
  contact_info?: Record<string, string>;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  business_hours?: Record<string, any>;
  services_offered?: string[];
  target_market?: string[];
  certifications?: string[];
  awards?: string[];
  partnerships?: string[];
  looking_for?: string[];
  can_provide?: string[];
}

interface SendConnectionPayload {
  target_profile_id: string;
  connection_type: 'partnership' | 'supplier' | 'distributor' | 'collaboration' | 'investment' | 'mentorship';
  message?: string;
}

interface UpdateConnectionPayload {
  status?: 'pending' | 'accepted' | 'rejected' | 'blocked';
  response_message?: string;
}

export const businessMatchingService = {
  async getProfiles(params?: GetProfilesParams): Promise<GetProfilesResponse> {
    const response = await api.get<GetProfilesResponse>('/business-matching/profiles', params);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch business profiles');
  },

  async getProfileBySlug(slug: string): Promise<BusinessProfile> {
    const response = await api.get<{ profile: BusinessProfile }>(`/business-matching/profiles/${slug}`);
    if (response.success && response.data?.profile) {
      return response.data.profile;
    }
    throw new Error(response.message || 'Failed to fetch business profile');
  },

  async getCategories(): Promise<BusinessCategory[]> {
    const response = await api.get<{ categories: BusinessCategory[] }>('/business-matching/categories');
    if (response.success && response.data?.categories) {
      return response.data.categories;
    }
    throw new Error(response.message || 'Failed to fetch business categories');
  },

  // Authenticated functions
  async createOrUpdateProfile(payload: CreateProfilePayload): Promise<{ profile: BusinessProfile }> {
    const response = await api.post<{ profile: BusinessProfile }>('/business-matching/profiles', payload);
    if (response.success && response.data?.profile) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create/update business profile');
  },

  async sendConnection(payload: SendConnectionPayload): Promise<{ connection: BusinessConnection }> {
    const response = await api.post<{ connection: BusinessConnection }>('/business-matching/connections', payload);
    if (response.success && response.data?.connection) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to send connection request');
  },

  async getMyConnections(params?: { status?: string; type?: string; page?: number; limit?: number }): Promise<{ connections: BusinessConnection[]; pagination: any }> {
    const response = await api.get<{ connections: BusinessConnection[]; pagination: any }>('/business-matching/connections/my', params);
    if (response.success && response.data?.connections) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch connections');
  },

  async updateConnectionStatus(connectionId: string, payload: UpdateConnectionPayload): Promise<{ connection: BusinessConnection }> {
    const response = await api.patch<{ connection: BusinessConnection }>(`/business-matching/connections/${connectionId}/status`, payload);
    if (response.success && response.data?.connection) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update connection status');
  },
};
