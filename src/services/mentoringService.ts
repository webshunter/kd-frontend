import { api } from './api';

export interface MentorCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  mentor_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Mentor {
  id: string;
  title: string;
  bio: string;
  experience_years: number;
  specializations?: string[];
  languages?: string[];
  hourly_rate: number | string; // Can be string from database
  is_available: boolean;
  is_verified: boolean;
  rating: number | string; // Can be string from database
  review_count: number;
  session_count: number;
  profile_image_url?: string;
  linkedin_url?: string;
  website_url?: string;
  portfolio_url?: string;
  achievements?: string[];
  education?: string[];
  certifications?: string[];
  created_at: string;
  // Joined fields
  mentor_name?: string;
  mentor_email?: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  category_icon?: string;
}

export interface MentorAvailability {
  id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface MentoringSession {
  id: string;
  mentor_id: string;
  mentee_id: string;
  title: string;
  description?: string;
  session_type: 'consultation' | 'workshop' | 'review' | 'guidance';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  meeting_link?: string;
  meeting_notes?: string;
  mentee_feedback?: string;
  mentee_rating?: number;
  mentor_feedback?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  mentor_title?: string;
  hourly_rate?: number;
  mentor_name?: string;
  mentee_name?: string;
}

interface GetMentorsResponse {
  mentors: Mentor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface GetMentorsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  available?: boolean;
  verified?: boolean;
  min_rating?: number;
  max_rate?: number;
  sort?: 'rating' | 'rate' | 'experience' | 'sessions';
}

interface BookSessionPayload {
  mentor_id: string;
  title: string;
  description?: string;
  session_type?: 'consultation' | 'workshop' | 'review' | 'guidance';
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes?: number;
}

interface UpdateSessionPayload {
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  meeting_link?: string;
  meeting_notes?: string;
  feedback?: string;
  rating?: number;
}

export const mentoringService = {
  async getMentors(params?: GetMentorsParams): Promise<GetMentorsResponse> {
    const response = await api.get<GetMentorsResponse>('/mentoring/mentors', params);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch mentors');
  },

  async getMentorById(id: string): Promise<Mentor> {
    const response = await api.get<{ mentor: Mentor }>(`/mentoring/mentors/${id}`);
    if (response.success && response.data?.mentor) {
      return response.data.mentor;
    }
    throw new Error(response.message || 'Failed to fetch mentor');
  },

  async getMentorAvailability(mentorId: string): Promise<MentorAvailability[]> {
    const response = await api.get<{ availability: MentorAvailability[] }>(`/mentoring/mentors/${mentorId}/availability`);
    if (response.success && response.data?.availability) {
      return response.data.availability;
    }
    throw new Error(response.message || 'Failed to fetch mentor availability');
  },

  async getCategories(): Promise<MentorCategory[]> {
    const response = await api.get<{ categories: MentorCategory[] }>('/mentoring/categories');
    if (response.success && response.data?.categories) {
      return response.data.categories;
    }
    throw new Error(response.message || 'Failed to fetch mentor categories');
  },

  // Authenticated functions
  async bookSession(payload: BookSessionPayload): Promise<{ session: MentoringSession }> {
    const response = await api.post<{ session: MentoringSession }>('/mentoring/sessions', payload);
    if (response.success && response.data?.session) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to book mentoring session');
  },

  async getMySessions(params?: { status?: string; type?: 'mentee' | 'mentor' }): Promise<{ sessions: MentoringSession[] }> {
    const response = await api.get<{ sessions: MentoringSession[] }>('/mentoring/sessions/my', params);
    if (response.success && response.data?.sessions) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch user sessions');
  },

  async updateSessionStatus(sessionId: string, payload: UpdateSessionPayload): Promise<{ session: MentoringSession }> {
    const response = await api.patch<{ session: MentoringSession }>(`/mentoring/sessions/${sessionId}/status`, payload);
    if (response.success && response.data?.session) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update session status');
  },
};
