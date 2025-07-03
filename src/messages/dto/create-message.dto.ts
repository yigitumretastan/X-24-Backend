import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'Mesaj içeriği' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Gönderen kullanıcı ID' })
  @IsMongoId()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ description: 'Alıcı kullanıcı ID', required: false })
  @IsOptional()
  @IsMongoId()
  receiver?: string;

  @ApiProperty({ description: 'Workspace ID' })
  @IsMongoId()
  @IsNotEmpty()
  workspace: string;

  @ApiProperty({ description: 'Mesaj türü', required: false })
  @IsOptional()
  @IsString()
  type?: string;
}