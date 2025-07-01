import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Ahmet',
    description: 'Kullanıcının tam adı',
  })
  @IsString()
  @IsNotEmpty({ message: 'İsim gerekli.' })
  name: string;

  @ApiProperty({
    example: 'Yılmaz',
    description: 'Kullanıcının tam soyadı',
  })
  @IsString()
  @IsNotEmpty({ message: 'Soyad gerekli.' })
  lastname: string;


  @ApiProperty({
    example: 'ahmet@example.com',
    description: 'Geçerli bir email adresi',
  })
  @IsEmail({}, { message: 'Geçerli bir email adresi girin.' })
  @IsNotEmpty({ message: 'Email gerekli.' })
  email: string;

  @ApiProperty({
    example: '5051234567',
    description: 'Kullanıcının telefon numarası',
  })
  @IsString()
  @IsNotEmpty({ message: 'Telefon numarası gerekli.' })
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'Kullanıcının şifresi (en az 6 karakter)',
  })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalı.' })
  @IsNotEmpty({ message: 'Şifre gerekli.' })
  password: string;

  @ApiPropertyOptional({
    example: 'Teknoloji A.Ş.',
    description: 'Yeni bir şirket oluşturmak için şirket adı. inviteCode yoksa zorunludur.',
  })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Mevcut bir şirkete katılmak için davet kodu',
  })
  @IsOptional()
  @IsString()
  inviteCode?: string;
}
