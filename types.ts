// FIX: Added all missing type definitions to resolve import errors.

// Enums for Views
export enum View {
  Home = 'Home',
  UMKM = 'UMKM',
  TangselMart = 'TangselMart',
  GoodSkill = 'GoodSkill',
  HalloHukum = 'HalloHukum',
  Pendanaan = 'Pendanaan',
  Forum = 'Forum',
  Koperasi = 'Koperasi',
  LowonganKerja = 'LowonganKerja',
  BusinessMatching = 'BusinessMatching',
  DigitalMarketing = 'DigitalMarketing',
  EventTangsel = 'EventTangsel',
  Mentoring = 'Mentoring',
  GoodEx = 'GoodEx',
  About = 'About',
  Pemkot = 'Pemkot',
  Berita = 'Berita',
  Login = 'Login',
  Register = 'Register',
  UMKMDashboard = 'UMKMDashboard',
  PaymentMembership = 'PaymentMembership',
  PaymentStatus = 'PaymentStatus',
}

export enum DashboardView {
    Overview = 'Overview',
    Profile = 'Profile',
    Products = 'Products',
    Orders = 'Orders',
    ManageUMKM = 'ManageUMKM',
    MembershipPremium = 'MembershipPremium',
    Courses = 'Courses',
    Settings = 'Settings',
    Checkout = 'Checkout',
    // Admin Management Views
    NewsManagement = 'NewsManagement',
    EventsManagement = 'EventsManagement',
    ForumManagement = 'ForumManagement',
    CoursesManagement = 'CoursesManagement',
    MentoringManagement = 'MentoringManagement',
    JobsManagement = 'JobsManagement',
    BusinessMatchingManagement = 'BusinessMatchingManagement',
}

// Navigation Types
export interface NavLink {
  label: string;
  view?: View;
  children?: NavLink[];
}

export interface DashboardNavLink {
  label: string;
  view: DashboardView;
  icon: string;
  roles: string[];
}

// User & Auth Types
export type UserRole = 'umkm_owner' | 'pemkot_staff' | 'kadin_staff' | 'admin' | null;

// Content Types
export interface Feature {
  icon: string;
  title: string;
  description: string;
  view: View;
  color: string;
}

export type UMKMFinancialRecording = 'none' | 'manual' | 'spreadsheet' | 'app';
export type UMKMProductPackaging = 'basic' | 'labeled' | 'professional' | 'irrelevant';
export type UMKMPaymentAdoption = 'cash_only' | 'transfer' | 'ewallet' | 'qris';
export type UMKMOnlinePresence = 'none' | 'social_media' | 'marketplace' | 'website';
export type UMKMCategory = 'Kuliner' | 'Fashion' | 'Jasa' | 'Kreatif' | 'Lainnya';


export interface UMKMProfile {
    id: number;
    businessName: string;
    ownerName: string;
    category: UMKMCategory;
    description: string;
    fullDescription?: string;
    image: string;
    gallery?: string[];
    address?: string;
    contact?: { phone?: string; email?: string; website?: string };
    socialMedia?: { instagram?: string; facebook?: string };
    tangselMartLink?: string;
    coordinates?: { lat: number; lng: number };
    financialRecording: UMKMFinancialRecording;
    productPackaging: UMKMProductPackaging;
    digitalPaymentAdoption: UMKMPaymentAdoption;
    onlinePresence: UMKMOnlinePresence;
}

export interface UMKMFormData {
    businessName: string;
    ownerName: string;
    phone: string;
    email: string;
    category: UMKMCategory;
    financialRecording: UMKMFinancialRecording;
    productPackaging: UMKMProductPackaging;
    digitalPaymentAdoption: UMKMPaymentAdoption;
    onlinePresence: UMKMOnlinePresence;
}

export type EventCategory = 'Bazaar' | 'Seminar' | 'Workshop' | 'Komunitas' | 'Lainnya';

export interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    address: string;
    category: EventCategory;
    description: string;
    organizer: string;
    image: string;
    registrationLink?: string;
    coordinates?: { lat: number; lng: number };
}

export type MentorExpertise = 'Pemasaran Digital' | 'Keuangan' | 'Branding & Strategi' | 'Operasional';

export interface Mentor {
    id: number;
    name: string;
    expertise: MentorExpertise;
    specialties: string[];
    company: string;
    image: string;
    bio: string;
    fullDescription: string;
    availableSlots: string[];
}

export interface Job {
    id: number;
    title: string;
    company: string;
    logo: string;
    location: 'Serpong' | 'Ciputat' | 'Pamulang' | 'Bintaro' | 'BSD' | 'Lainnya';
    type: 'Penuh Waktu' | 'Paruh Waktu' | 'Kontrak' | 'Magang';
    description: string;
    requirements: string[];
    salary?: string;
    postedDate: string;
    companyDescription: string;
    benefits: string[];
}

export interface CooperativeNews {
    image: string;
    category: string;
    title: string;
    date: string;
    excerpt: string;
    fullContent: string;
}

export interface NewsArticle {
    id: string;
    image: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    fullContent: string;
}

// Interaction Types
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export type OrderStatus = 'Selesai' | 'Dikirim' | 'Diproses' | 'Dibatalkan';

export interface Order {
    id: string;
    date: string;
    customerName: string;
    total: number;
    status: OrderStatus;
    items: { id: number; name: string; quantity: number; price: number }[];
}

export interface Notification {
  id: number;
  icon: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface SearchResult {
  type: 'UMKM' | 'Berita' | 'Kursus' | string;
  id: number | string;
  title: string;
  description: string;
  view: View;
  icon: string;
}