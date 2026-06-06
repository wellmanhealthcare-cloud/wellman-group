export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  job_type: string;
  description: string;
  responsibilities: string;
  requirements: string;
  is_open: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobOpeningCreate {
  title: string;
  department: string;
  location: string;
  job_type: string;
  description: string;
  responsibilities: string;
  requirements: string;
  is_open?: boolean;
}

export type JobOpeningUpdate = Partial<JobOpeningCreate>;

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter: string | null;
  is_read: boolean;
  applied_at: string;
}

export interface JobApplicationCreate {
  applicant_name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter?: string;
}
