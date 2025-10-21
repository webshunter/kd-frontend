import { api } from './api';

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  course_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  full_description?: string;
  image_url?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  price: number | string; // Can be string from database
  is_free: boolean;
  is_featured: boolean;
  is_published: boolean;
  enrollment_count: number;
  rating: number | string; // Can be string from database
  review_count: number;
  language: string;
  prerequisites?: string[];
  learning_objectives?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Joined fields
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  category_icon?: string;
  instructor_name?: string;
  instructor_role?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  sort_order: number;
  is_published: boolean;
  lesson_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
  video_duration: number;
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment';
  sort_order: number;
  is_published: boolean;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  last_accessed_at: string;
  status: 'active' | 'completed' | 'dropped' | 'suspended';
  course_id: string;
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  level: string;
  duration_hours: number;
  is_free: boolean;
  rating: number;
  review_count: number;
  category_name?: string;
  category_color?: string;
  instructor_name?: string;
}

interface GetCoursesResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface GetCoursesParams {
  page?: number;
  limit?: number;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  search?: string;
  featured?: boolean;
  free?: boolean;
  published?: boolean;
  sort?: 'created_at' | 'rating' | 'enrollment' | 'price';
}

export const courseService = {
  async getCourses(params?: GetCoursesParams): Promise<GetCoursesResponse> {
    const response = await api.get<GetCoursesResponse>('/courses', params);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch courses');
  },

  async getCourseBySlug(slug: string): Promise<Course> {
    const response = await api.get<{ course: Course }>(`/courses/${slug}`);
    if (response.success && response.data?.course) {
      return response.data.course;
    }
    throw new Error(response.message || 'Failed to fetch course');
  },

  async getCourseModules(slug: string): Promise<CourseModule[]> {
    const response = await api.get<{ modules: CourseModule[] }>(`/courses/${slug}/modules`);
    if (response.success && response.data?.modules) {
      return response.data.modules;
    }
    throw new Error(response.message || 'Failed to fetch course modules');
  },

  async getCourseLessons(slug: string, moduleId: string): Promise<CourseLesson[]> {
    const response = await api.get<{ lessons: CourseLesson[] }>(`/courses/${slug}/modules/${moduleId}/lessons`);
    if (response.success && response.data?.lessons) {
      return response.data.lessons;
    }
    throw new Error(response.message || 'Failed to fetch course lessons');
  },

  async getCategories(): Promise<CourseCategory[]> {
    const response = await api.get<{ categories: CourseCategory[] }>('/courses/categories/all');
    if (response.success && response.data?.categories) {
      return response.data.categories;
    }
    throw new Error(response.message || 'Failed to fetch course categories');
  },

  // Authenticated functions
  async enrollInCourse(slug: string): Promise<{ enrollment: any }> {
    const response = await api.post<{ enrollment: any }>(`/courses/${slug}/enroll`);
    if (response.success && response.data?.enrollment) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to enroll in course');
  },

  async getMyEnrollments(params?: { page?: number; limit?: number; status?: string }): Promise<{ enrollments: CourseEnrollment[] }> {
    const response = await api.get<{ enrollments: CourseEnrollment[] }>('/courses/my/enrollments', params);
    if (response.success && response.data?.enrollments) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch user enrollments');
  },
};
