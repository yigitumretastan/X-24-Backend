import { IsString, ValidateIf, IsNotEmpty, IsBoolean } from 'class-validator';

export class LoginDto {
  @ValidateIf((o) => !o.phone)
  @IsString()
  @IsNotEmpty()
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  rememberMe: boolean;
}
