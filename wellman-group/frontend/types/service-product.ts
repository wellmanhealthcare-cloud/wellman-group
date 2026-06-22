export interface ProductItem {
  id: string;
  service_slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export type ProductItemCreate = Omit<ProductItem, 'id' | 'created_at'>;
export type ProductItemUpdate = Partial<ProductItemCreate>;
