export interface Inquiry {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface InquiryCreate {
  full_name: string;
  company_name?: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
