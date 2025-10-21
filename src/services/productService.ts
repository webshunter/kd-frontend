import { api } from './api';
import { DashboardProduct, ProductInput } from '../types/dashboard';
import { mapProduct } from './transformers';

const toSnakeCaseProduct = (payload: Partial<ProductInput>) => {
  const entries = Object.entries(payload).map(([key, value]) => {
    if (value === undefined) {
      return null;
    }

    switch (key) {
      case 'costPrice':
        return ['cost_price', value];
      case 'stockQuantity':
        return ['stock_quantity', value];
      case 'imageUrl':
        return ['image_url', value];
      case 'gallery':
        return ['gallery', value];
      case 'compareAtPrice':
        return ['compare_at_price', value];
      case 'discountPercentage':
        return ['discount_percentage', value];
      case 'trackInventory':
        return ['track_inventory', value];
      case 'allowBackorder':
        return ['allow_backorder', value];
      case 'isFeatured':
        return ['is_featured', value];
      case 'isDigital':
        return ['is_digital', value];
      case 'isActive':
        return ['is_active', value];
      default:
        return [key.replace(/([A-Z])/g, '_$1').toLowerCase(), value];
    }
  }).filter(Boolean) as [string, unknown][];

  return Object.fromEntries(entries);
};

class ProductService {
  // Get all public products for TangselMart
  async getAllProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  }): Promise<{ data: any[]; meta?: any }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.featured) queryParams.append('featured', 'true');
    
    const response = await api.get(`/products?${queryParams.toString()}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Gagal memuat produk');
    }

    return {
      data: Array.isArray(response.data) ? response.data : [],
      meta: response.meta
    };
  }

  // Get single product by ID
  async getProduct(id: string): Promise<any> {
    const response = await api.get(`/products/${id}`);
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Gagal memuat produk');
    }

    return response.data;
  }

  async getMyProducts(): Promise<DashboardProduct[]> {
    const response = await api.get('/products/me');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Gagal memuat daftar produk');
    }

    return Array.isArray(response.data) ? response.data.map(mapProduct) : [];
  }

  async createProduct(payload: ProductInput): Promise<DashboardProduct> {
    const response = await api.post('/products', toSnakeCaseProduct(payload));
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Gagal membuat produk');
    }
    return mapProduct(response.data);
  }

  async updateProduct(id: string, payload: Partial<ProductInput>): Promise<DashboardProduct> {
    const response = await api.put(`/products/${id}`, toSnakeCaseProduct(payload));
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Gagal memperbarui produk');
    }
    return mapProduct(response.data);
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await api.delete(`/products/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Gagal menghapus produk');
    }
  }
}

export const productService = new ProductService();
