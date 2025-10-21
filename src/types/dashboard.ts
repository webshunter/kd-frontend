export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface DashboardUMKMProfile {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  category: string;
  description?: string;
  fullDescription?: string;
  imageUrl?: string;
  gallery: string[];
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  tangselMartLink?: string;
  tokopediaLink?: string;
  shopeeLink?: string;
  financialRecording: string;
  productPackaging: string;
  digitalPaymentAdoption: string;
  onlinePresence: string;
  readinessScore: number;
  verificationStatus: VerificationStatus;
  isFeatured: boolean;
  isActive: boolean;
  slug?: string;
  createdAt: string;
  updatedAt: string;
  userEmail?: string;
  userName?: string;
}

export interface DashboardUMKMSummary {
  readiness: {
    id: string;
    readinessScore: number;
    financialRecording: string;
    productPackaging: string;
    digitalPaymentAdoption: string;
    onlinePresence: string;
  };
  stats: {
    totalRevenue: number;
    newOrders: number;
    totalOrders: number;
    bestSeller: string;
  };
}

export interface DashboardProduct {
  id: string;
  umkmId: string;
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  barcode?: string;
  imageUrl?: string;
  gallery: string[];
  weight?: number;
  dimensions?: Record<string, any> | null;
  compareAtPrice?: number;
  discountPercentage?: number;
  tags?: string[];
  trackInventory: boolean;
  allowBackorder: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardOrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl?: string;
}

export type DashboardOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface DashboardOrder {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  umkmId: string;
  umkmName?: string;
  totalAmount: number;
  status: DashboardOrderStatus;
  paymentStatus?: string;
  paymentMethod?: string;
  shippingAddress?: string | Record<string, any> | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: DashboardOrderItem[];
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  stockQuantity?: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  barcode?: string;
  imageUrl?: string;
  gallery?: string[];
  weight?: number;
  dimensions?: Record<string, any> | null;
  compareAtPrice?: number;
  discountPercentage?: number;
  tags?: string[];
  trackInventory?: boolean;
  allowBackorder?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  isActive?: boolean;
}

export interface ProductFormState {
  name: string;
  price: string;
  stockQuantity: string;
  category: string;
  description: string;
  imageUrl: string;
}
