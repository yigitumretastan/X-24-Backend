import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, IsMongoId, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
  OTHER = 'other',
}

// Okunma durumu için opsiyonel olarak kullanılabilir, genelde mesaj yaratılırken gerekmez ama ekledim.
class ReadStatusDto {
  @IsMongoId()
  user: string;

  @IsOptional()
  isRead?: boolean;

  @IsOptional()
  readAt?: Date;
}

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  sender: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  receivers: string[];

  @IsMongoId()
  workspace: string;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReadStatusDto)
  readStatus?: ReadStatusDto[];

  @IsOptional()
  metadata?: Record<string, any>;
}
