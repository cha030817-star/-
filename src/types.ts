export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  priceType: 'market' | 'fixed' | 'gold' | 'silver';
  displayOrder: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  image: string;
  description: string;
  isNew?: boolean;
  isBest?: boolean;
}

export interface Popup {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  position: 'center' | 'bottom-left' | 'bottom-right' | 'top-banner' | 'custom';
  size: 'small' | 'medium' | 'large' | 'full';
  startDate: string;
  endDate: string;
  isActive: boolean;
  displayOrder: number;
  customX?: string;
  customY?: string;
  mobileX?: string;
  mobileY?: string;
  layoutType?: 'image-top' | 'image-bottom' | 'image-only';
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'news' | 'price';
  createdAt: string;
}

export interface SiteConfig {
  bannerImage: string;
  themeColor: string;
  fontFamily: string;
  logoUrl?: string;
  siteName: string;
}

export interface GoldPrice {
  id: string;
  name: string;
  nameEn: string;
  buyPrice: number;
  sellPrice: number;
  change: 'up' | 'down' | 'none';
  changeValue: number;
  metal: 'gold' | 'silver';
  category: string;
  displayOrder: number;
}

export interface ChartData {
  date: string;
  price: number;
}

export interface InternationalPrice {
  goldUsd: number;
  silverUsd: number;
  exchangeRate: number;
}

export interface Consultation {
  id: string;
  name: string;
  phone: string;
  email: string;
  content: string;
  preferredDate?: string;
  photoUrl?: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  date: string;
  isActive: boolean;
  category: 'gold' | 'exchange' | 'international' | 'economy';
  source: string;
  url?: string;
  type: 'sample' | 'custom';
  updatedAt?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type Language = 'ko' | 'en';
