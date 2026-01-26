import { IsIn, IsOptional, IsString, IsUrl, Length } from "class-validator";
import type { UpdateApplicationInput } from "@job-tracker/shared";

const statuses = ["applied","screening","interviewing","rejected","ghosted"] as const;

export class UpdateApplicationDto implements UpdateApplicationInput {
  @IsString()
  @IsOptional()
  @Length(1, 200)
  company!: string;

  @IsString()
  @Length(1, 200)
  @IsOptional()
  job_title!: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  applied_through?: string | null;

  @IsOptional()
  @IsUrl()
  @IsOptional()
  link?: string | null;

  @IsIn(statuses)
  @IsOptional()
  status!: (typeof statuses)[number];

  @IsOptional()
  @IsString() // validate format yourself or use a custom validator
  applied_at?: string | null;

  @IsOptional()
  @IsString()
  cv_used?: string | null;
}
