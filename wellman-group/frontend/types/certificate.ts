export interface Certificate {
  id: string;
  title: string;
  issuing_body: string;
  issue_date: string;
  expiry_date: string | null;
  file_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface CertificateCreate {
  title: string;
  issuing_body: string;
  issue_date: string;
  expiry_date?: string;
  file_url: string;
  order_index?: number;
  is_active?: boolean;
}

export type CertificateUpdate = Partial<CertificateCreate>;
