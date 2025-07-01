import { IsOptional, IsString } from 'class-validator';

export class UpdateTimeEntryDto {
  @IsOptional()
  @IsString()
  description?: string;
}
