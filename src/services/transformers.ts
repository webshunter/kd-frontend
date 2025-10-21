import { DashboardProduct, DashboardUMKMProfile, DashboardOrder, DashboardOrderItem, DashboardUMKMSummary } from '../types/dashboard';

const toCamel = (value: any) => value === null || value === undefined ? undefined : value;

export const mapProduct = (raw: any): DashboardProduct => ({
  id: raw.id,
  umkmId: raw.umkm_id,
  name: raw.name,
  description: toCamel(raw.description),
  price: Number(raw.price),
  costPrice: raw.cost_price !== null ? Number(raw.cost_price) : undefined,
  stockQuantity: raw.stock_quantity ?? 0,
  category: toCamel(raw.category),
  subcategory: toCamel(raw.subcategory),
  brand: toCamel(raw.brand),
  sku: toCamel(raw.sku),
  barcode: toCamel(raw.barcode),
  imageUrl: toCamel(raw.image_url),
  gallery: Array.isArray(raw.gallery) ? raw.gallery : raw.gallery ? JSON.parse(raw.gallery) : [],
  weight: raw.weight !== null ? Number(raw.weight) : undefined,
  dimensions: raw.dimensions ? (typeof raw.dimensions === 'string' ? JSON.parse(raw.dimensions) : raw.dimensions) : null,
  compareAtPrice: raw.compare_at_price !== null ? Number(raw.compare_at_price) : undefined,
  discountPercentage: raw.discount_percentage !== null ? Number(raw.discount_percentage) : undefined,
  tags: Array.isArray(raw.tags) ? raw.tags : raw.tags ? raw.tags : [],
  trackInventory: raw.track_inventory ?? true,
  allowBackorder: raw.allow_backorder ?? false,
  isFeatured: raw.is_featured ?? false,
  isDigital: raw.is_digital ?? false,
  isActive: raw.is_active ?? true,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

export const mapUMKMProfile = (raw: any): DashboardUMKMProfile => ({
  id: raw.id,
  userId: raw.user_id,
  businessName: raw.business_name,
  ownerName: raw.owner_name,
  category: raw.category,
  description: toCamel(raw.description),
  fullDescription: toCamel(raw.full_description),
  imageUrl: toCamel(raw.image_url),
  gallery: Array.isArray(raw.gallery) ? raw.gallery : raw.gallery ? JSON.parse(raw.gallery) : [],
  address: toCamel(raw.address),
  phone: toCamel(raw.phone),
  email: toCamel(raw.email),
  website: toCamel(raw.website),
  instagram: toCamel(raw.instagram),
  facebook: toCamel(raw.facebook),
  tiktok: toCamel(raw.tiktok),
  youtube: toCamel(raw.youtube),
  tangselMartLink: toCamel(raw.tangsel_mart_link),
  tokopediaLink: toCamel(raw.tokopedia_link),
  shopeeLink: toCamel(raw.shopee_link),
  financialRecording: raw.financial_recording,
  productPackaging: raw.product_packaging,
  digitalPaymentAdoption: raw.digital_payment_adoption,
  onlinePresence: raw.online_presence,
  readinessScore: raw.readiness_score ?? 0,
  verificationStatus: raw.verification_status,
  isFeatured: raw.is_featured ?? false,
  isActive: raw.is_active ?? true,
  slug: toCamel(raw.slug),
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  userEmail: toCamel(raw.user_email),
  userName: toCamel(raw.user_name),
});

const mapOrderItem = (raw: any): DashboardOrderItem => ({
  id: raw.id,
  productName: raw.product_name,
  quantity: Number(raw.quantity),
  price: Number(raw.price ?? raw.product_price ?? 0),
  subtotal: Number(raw.subtotal),
  imageUrl: toCamel(raw.image_url),
});

export const mapOrder = (raw: any): DashboardOrder => ({
  id: raw.id,
  orderNumber: raw.order_number,
  customerId: raw.customer_user_id,
  customerName: toCamel(raw.customer_name) ?? toCamel(raw.customer_full_name),
  customerEmail: toCamel(raw.customer_email),
  customerPhone: toCamel(raw.customer_phone),
  umkmId: raw.umkm_id,
  umkmName: toCamel(raw.umkm_name),
  totalAmount: Number(raw.total_amount),
  status: raw.status,
  paymentStatus: toCamel(raw.payment_status),
  paymentMethod: toCamel(raw.payment_method),
  shippingAddress: toCamel(raw.shipping_address),
  notes: toCamel(raw.notes),
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  items: Array.isArray(raw.items) ? raw.items.map(mapOrderItem) : [],
});

export const mapUMKMSummary = (raw: any): DashboardUMKMSummary => {
  const readinessSource = raw?.readiness ?? {};
  const statsSource = raw?.stats ?? {};

  return {
    readiness: {
      id: readinessSource.id ?? '',
      readinessScore: Number(readinessSource.readiness_score ?? readinessSource.readinessScore ?? 0),
      financialRecording: readinessSource.financial_recording ?? readinessSource.financialRecording ?? 'none',
      productPackaging: readinessSource.product_packaging ?? readinessSource.productPackaging ?? 'basic',
      digitalPaymentAdoption: readinessSource.digital_payment_adoption ?? readinessSource.digitalPaymentAdoption ?? 'cash_only',
      onlinePresence: readinessSource.online_presence ?? readinessSource.onlinePresence ?? 'none',
    },
    stats: {
      totalRevenue: Number(statsSource.totalRevenue ?? statsSource.total_revenue ?? 0),
      newOrders: Number(statsSource.newOrders ?? statsSource.new_orders ?? 0),
      totalOrders: Number(statsSource.totalOrders ?? statsSource.total_orders ?? 0),
      bestSeller: statsSource.bestSeller ?? statsSource.best_seller ?? 'Belum ada data',
    },
  };
};
