export interface DashboardStats {
  total_projects: number;
  total_services: number;
  total_clients: number;
  total_team_members: number;
  total_testimonials: number;
  total_jobs: number;
  open_jobs: number;
  total_inquiries: number;
  unread_inquiries: number;
  total_applications: number;
  unread_applications: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  last_updated: string;
}
