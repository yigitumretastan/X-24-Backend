import { IsString, IsNotEmpty, IsDateString, IsOptional, IsMongoId, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: 'Etkinlik başlığı' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Etkinlik açıklaması' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Başlangıç tarihi' })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ description: 'Bitiş tarihi' })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ description: 'Oluşturan kullanıcı ID' })
  @IsMongoId()
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty({ description: 'Workspace ID' })
  @IsMongoId()
  @IsNotEmpty()
  workspace: string;

  @ApiPropertyOptional({ description: 'Katılımcı ID listesi' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  participants?: string[];

  @ApiPropertyOptional({ description: 'Etkinlik türü' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Etkinlik rengi' })
  @IsOptional()
  @IsString()
  color?: string;
}