export const ApplicationStatus = [
  "applied",
  "screening",
  "interviewing",
  "rejected",
  "ghosted",
] as const;

export type ApplicationStatus = (typeof ApplicationStatus)[number];

export type CreateApplicationInput = {
  company: string;
  job_title: string;
  applied_through?: string | null;
  link?: string | null;
  status: ApplicationStatus;
  applied_at?: string | null; // ISO date string "YYYY-MM-DD"
  cv_used?: string | null;
};


export type UpdateApplicationInput = Partial<CreateApplicationInput>;
