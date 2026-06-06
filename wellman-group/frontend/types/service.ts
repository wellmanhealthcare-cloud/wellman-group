export interface Service {
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
}

export interface ServiceCreate {
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

export type ServiceUpdate = Partial<ServiceCreate>;
