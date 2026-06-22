export type NotificationChannel = 'whatsapp' | 'email' | 'both';

export interface SiteSettings {
  id: string;
  company_name: string;
  tagline: string | null;
  unit_address: string | null;
  office_address: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  email_primary: string | null;
  email_secondary: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  youtube_url: string | null;
  google_maps_url: string | null;
  brochure_url: string | null;
  footer_text: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  notification_channel: NotificationChannel;
  updated_at: string;
}

export type SiteSettingsUpdate = Partial<Omit<SiteSettings, 'id' | 'updated_at'>>;
