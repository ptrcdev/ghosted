export type ApplicationStatus = 'applied' | 'screening' | 'interviewing' | 'offer' | 'rejected' | 'ghosted';

export interface JobApplication {
  id: string;
  user_id: string;
  company: string;
  job_title: string;
  status: ApplicationStatus;
  applied_at: string;
  salary_range: string | null;
  location: string | null;
  link: string | null;
  cv_used: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplicationInsert {
  company: string;
  job_title: string;
  status?: ApplicationStatus;
  applied_at?: string;
  salary_range?: string | null;
  location?: string | null;
  link?: string | null;
  cv_used?: string | File | null;
}

export interface JobApplicationUpdate extends Partial<JobApplicationInsert> {}

export const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'screening', label: 'Screening', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'interviewing', label: 'Interviewing', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'offer', label: 'Offer', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'ghosted', label: 'Ghosted', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
];

export type SortOption = 'applied_at_desc' | 'applied_at_asc' | 'company_name_asc' | 'company_name_desc' | 'updated_at_desc';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'applied_at_desc', label: 'Most Recent' },
  { value: 'applied_at_asc', label: 'Oldest First' },
  { value: 'updated_at_desc', label: 'Recently Updated' },
  { value: 'company_name_asc', label: 'Company A-Z' },
  { value: 'company_name_desc', label: 'Company Z-A' },
];
