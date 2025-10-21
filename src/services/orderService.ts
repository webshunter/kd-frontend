import { api } from './api';
import { DashboardOrder, DashboardOrderStatus } from '../types/dashboard';
import { mapOrder } from './transformers';

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: DashboardOrderStatus;
  role?: 'buyer' | 'seller';
}

class OrderService {
  async getOrders(params: OrderQueryParams = {}): Promise<{
    data: DashboardOrder[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }> {
    const response = await api.get('/orders', {
      ...params,
      role: params.role ?? 'seller',
    });

    if (!response.success) {
      throw new Error(response.message || 'Gagal memuat pesanan');
    }

    const orders = Array.isArray(response.data) ? response.data.map(mapOrder) : [];
    const pagination = response.meta?.pagination ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      total: orders.length,
      pages: 1,
    };

    return { data: orders, pagination };
  }

  async updateStatus(id: string, status: DashboardOrderStatus): Promise<DashboardOrder> {
    const response = await api.patch(`/orders/${id}/status`, { status });
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Gagal memperbarui status pesanan');
    }
    return mapOrder(response.data);
  }
}

export const orderService = new OrderService();
