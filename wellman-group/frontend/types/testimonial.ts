export interface Testimonial {
  id: string;
  client_name: string;
  designation: string;
  hospital_name: string;
  message: string;
  photo_url: string | null;
  rating: number;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface TestimonialCreate {
  client_name: string;
  designation: string;
  hospital_name: string;
  message: string;
  photo_url?: string;
  rating: number;
  order_index?: number;
  is_active?: boolean;
}

export type TestimonialUpdate = Partial<TestimonialCreate>;
