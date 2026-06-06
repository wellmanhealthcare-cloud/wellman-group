export interface HeroSlide {
  id: string;
  image_url: string;
  heading: string;
  subheading: string | null;
  cta_text: string;
  cta_link: string;
  order_index: number;
  is_active: boolean;
}

export interface HeroSlideCreate {
  image_url: string;
  heading: string;
  subheading?: string;
  cta_text: string;
  cta_link: string;
  order_index?: number;
  is_active?: boolean;
}

export type HeroSlideUpdate = Partial<HeroSlideCreate>;
