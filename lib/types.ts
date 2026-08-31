export interface StoreSettings {
  name: string;
  slogan: string;
  announcement: string;
  description: string;
  instagram?: string;
  tiktok?: string;
  email?: string;
}

export interface WhatsAppSettings {
  number: string;
  message: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  image: string;
  accent: string;
  description: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  discount?: number;
  badge?: string;
  categoryId?: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  badge?: string;
  featured: boolean;
  sizes: string[];
  images: string[];
  inStock: boolean;
}

export interface StoreData {
  store: StoreSettings;
  whatsapp: WhatsAppSettings;
  categories: Category[];
  promotions: Promotion[];
  products: Product[];
}
