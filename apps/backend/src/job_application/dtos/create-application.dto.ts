import { IsIn, IsOptional, IsString, IsUrl, Length } from "class-validator";
import type { CreateApplicationInput } from "@job-tracker/shared";

const statuses = ["applied","screening","interviewing","rejected","ghosted"] as const;

export class CreateApplicationDto implements CreateApplicationInput {
  @IsString()
  @Length(1, 200)
  company!: string;

  @IsString()
  @Length(1, 200)
  job_title!: string;

  @IsOptional()
  @IsString()
  applied_through?: string | null;

  @IsOptional()
  @IsUrl()
  link?: string | null;

  @IsIn(statuses)
  status!: (typeof statuses)[number];

  @IsOptional()
  @IsString() // validate format yourself or use a custom validator
  applied_at?: string | null;

  @IsOptional()
  @IsString()
  cv_used?: string | null;

  @IsString()
  user_id: string;
}
