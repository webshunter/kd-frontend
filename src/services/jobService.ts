import { api } from './api';

export interface JobCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  job_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  category_id: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  salary_min?: number | string; // Can be string from database
  salary_max?: number | string; // Can be string from database
  salary_currency: string;
  location: string;
  is_remote: boolean;
  application_deadline?: string;
  max_applications?: number;
  current_applications: number;
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  company_name?: string;
  company_email?: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  category_icon?: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  expected_salary?: number | string; // Can be string from database
  available_start_date?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'accepted' | 'withdrawn';
  notes?: string;
  applied_at: string;
  updated_at: string;
  // Joined fields
  job_title?: string;
  job_slug?: string;
  job_location?: string;
  employment_type?: string;
  salary_min?: number | string; // Can be string from database
  salary_max?: number | string; // Can be string from database
  company_name?: string;
  applicant_name?: string;
  applicant_email?: string;
}

interface GetJobsResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface GetJobsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  location?: string;
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
  salary_min?: number;
  salary_max?: number;
  featured?: boolean;
  status?: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  sort?: 'created_at' | 'salary' | 'deadline' | 'featured';
}

interface ApplyJobPayload {
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  expected_salary?: number;
  available_start_date?: string;
}

interface UpdateApplicationPayload {
  status?: 'pending' | 'reviewing' | 'shortlisted' | 'interview' | 'rejected' | 'accepted' | 'withdrawn';
  notes?: string;
}

export const jobService = {
  async getJobs(params?: GetJobsParams): Promise<GetJobsResponse> {
    const response = await api.get<GetJobsResponse>('/jobs', params);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch jobs');
  },

  async getJobBySlug(slug: string): Promise<Job> {
    const response = await api.get<{ job: Job }>(`/jobs/${slug}`);
    if (response.success && response.data?.job) {
      return response.data.job;
    }
    throw new Error(response.message || 'Failed to fetch job');
  },

  async getCategories(): Promise<JobCategory[]> {
    const response = await api.get<{ categories: JobCategory[] }>('/jobs/categories/all');
    if (response.success && response.data?.categories) {
      return response.data.categories;
    }
    throw new Error(response.message || 'Failed to fetch job categories');
  },

  // Authenticated functions
  async applyForJob(jobId: string, payload: ApplyJobPayload): Promise<{ application: JobApplication }> {
    const response = await api.post<{ application: JobApplication }>(`/jobs/${jobId}/apply`, payload);
    if (response.success && response.data?.application) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to apply for job');
  },

  async getMyApplications(params?: { status?: string; page?: number; limit?: number }): Promise<{ applications: JobApplication[]; pagination: any }> {
    const response = await api.get<{ applications: JobApplication[]; pagination: any }>('/jobs/applications/my', params);
    if (response.success && response.data?.applications) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch applications');
  },

  async getJobApplications(jobId: string, params?: { status?: string; page?: number; limit?: number }): Promise<{ applications: JobApplication[]; pagination: any }> {
    const response = await api.get<{ applications: JobApplication[]; pagination: any }>(`/jobs/${jobId}/applications`, params);
    if (response.success && response.data?.applications) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch job applications');
  },

  async updateApplicationStatus(applicationId: string, payload: UpdateApplicationPayload): Promise<{ application: JobApplication }> {
    const response = await api.patch<{ application: JobApplication }>(`/jobs/applications/${applicationId}/status`, payload);
    if (response.success && response.data?.application) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update application status');
  },
};
