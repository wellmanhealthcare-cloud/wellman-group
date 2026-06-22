export interface ProductImage {
  id: string;
  image_url: string;
  caption: string | null;
  order_index: number;
}

export interface ProductImageCreate {
  image_url: string;
  caption?: string;
  order_index?: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  long_desc: string;
  icon_url: string | null;
  order_index: number;
  is_active: boolean;
  meta_title: string | null;
  meta_desc: string | null;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export interface ProductCreate {
  title: string;
  slug: string;
  short_desc: string;
  long_desc: string;
  icon_url?: string;
  order_index?: number;
  is_active?: boolean;
  meta_title?: string;
  meta_desc?: string;
}

export type ProductUpdate = Partial<ProductCreate>;
