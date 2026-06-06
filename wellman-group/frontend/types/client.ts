export interface Client {
  id: string;
  hospital_name: string;
  city: string;
  state: string;
  logo_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface ClientCreate {
  hospital_name: string;
  city: string;
  state: string;
  logo_url: string;
  order_index?: number;
  is_active?: boolean;
}

export type ClientUpdate = Partial<ClientCreate>;
