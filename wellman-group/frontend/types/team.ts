export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  bio: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberCreate {
  name: string;
  designation: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  order_index?: number;
  is_active?: boolean;
}

export type TeamMemberUpdate = Partial<TeamMemberCreate>;
