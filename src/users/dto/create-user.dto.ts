import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  readonly lastname?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  workType?: string;

  @IsOptional()
  @IsString()
  workLocation?: string;

  @IsOptional()
  @IsString()
  team?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  links?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };

  @IsOptional()
  @IsString()
  inviteCode?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  readonly provider?: string;

  @IsOptional()
  @IsString()
  readonly workspace?: string;
}