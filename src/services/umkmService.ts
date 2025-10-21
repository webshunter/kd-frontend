import { api } from './api';
import { DashboardUMKMProfile, DashboardUMKMSummary } from '../types/dashboard';
import { mapUMKMProfile, mapUMKMSummary } from './transformers';

export interface UMKMQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  featured?: boolean;
  verified?: boolean;
}

export interface UMKMUpsertPayload {
  businessName: string;
  ownerName: string;
  category: string;
  description?: string;
  fullDescription?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  financialRecording?: string;
  productPackaging?: string;
  digitalPaymentAdoption?: string;
  onlinePresence?: string;
}

const toSnakeCasePayload = (payload: Partial<UMKMUpsertPayload>) => {
  const entries = Object.entries(payload).map(([key, value]) => {
    if (value === undefined) {
      return null;
    }

    switch (key) {
      case 'businessName':
        return ['business_name', value];
      case 'ownerName':
        return ['owner_name', value];
      case 'fullDescription':
        return ['full_description', value];
      case 'financialRecording':
        return ['financial_recording', value];
      case 'productPackaging':
        return ['product_packaging', value];
      case 'digitalPaymentAdoption':
        return ['digital_payment_adoption', value];
      case 'onlinePresence':
        return ['online_presence', value];
      default:
        return [key.replace(/([A-Z])/g, '_$1').toLowerCase(), value];
    }
  }).filter(Boolean) as [string, unknown][];

  return Object.fromEntries(entries);
};

class UMKMService {
  async getAll(params: UMKMQueryParams = {}): Promise<{
    data: DashboardUMKMProfile[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const response = await api.get('/umkm', {
      ...params,
      featured: params.featured ? 'true' : undefined,
      verified: params.verified === false ? 'false' : undefined,
    });

    if (!response.success) {
      throw new Error(response.message || 'Gagal memuat daftar UMKM');
    }

    const rows = Array.isArray(response.data) ? response.data.map(mapUMKMProfile) : [];
    const pagination = response.meta?.pagination ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      total: rows.length,
      pages: 1,
    };

    return { data: rows, pagination };
  }

  async getById(id: string): Promise<DashboardUMKMProfile> {
    const response = await api.get(`/umkm/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'UMKM tidak ditemukan');
    }
    return mapUMKMProfile(response.data);
  }

  async getMyProfile(): Promise<DashboardUMKMProfile | null> {
    try {
      const response = await api.get('/umkm/me');
      if (!response.success || !response.data) {
        return null;
      }
      return mapUMKMProfile(response.data);
    } catch (error) {
      return null;
    }
  }

  async getMySummary(): Promise<DashboardUMKMSummary> {
    const response = await api.get('/umkm/me/summary');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Gagal memuat ringkasan UMKM');
    }
    return mapUMKMSummary(response.data);
  }

  async create(payload: UMKMUpsertPayload): Promise<DashboardUMKMProfile> {
    const response = await api.post('/umkm', toSnakeCasePayload(payload));
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Gagal membuat profil UMKM');
    }
    return mapUMKMProfile(response.data);
  }

  async update(id: string, payload: Partial<UMKMUpsertPayload>): Promise<DashboardUMKMProfile> {
    const response = await api.put(`/umkm/${id}`, toSnakeCasePayload(payload));
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Gagal memperbarui profil UMKM');
    }
    return mapUMKMProfile(response.data);
  }
}

export const umkmService = new UMKMService();

export type { DashboardUMKMProfile };