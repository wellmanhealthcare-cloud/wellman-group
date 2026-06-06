export interface ProjectImage {
  id: string;
  image_url: string;
  caption: string | null;
  order_index: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  city: string;
  state: string;
  service_id: string;
  description: string;
  completion_date: string;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
  meta_title: string | null;
  meta_desc: string | null;
  created_at: string;
  updated_at: string;
  cover_image_url?: string | null;
  images: ProjectImage[];
}

export type ProjectListItem = Omit<Project, 'images'>;

export interface ProjectCreate {
  title: string;
  slug: string;
  client_name: string;
  city: string;
  state: string;
  service_id: string;
  description: string;
  completion_date: string;
  is_featured?: boolean;
  is_active?: boolean;
  order_index?: number;
  meta_title?: string;
  meta_desc?: string;
}

export type ProjectUpdate = Partial<ProjectCreate>;

export interface ProjectImageCreate {
  image_url: string;
  caption?: string;
  order_index?: number;
}

export interface ReorderItem {
  id: string;
  order_index: number;
}
