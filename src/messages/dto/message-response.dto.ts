import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ description: 'Mesaj ID' })
  id: string;

  @ApiProperty({ description: 'Mesaj içeriği' })
  content: string;

  @ApiProperty({ description: 'Gönderen kullanıcı bilgileri' })
  sender: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({ description: 'Alıcı kullanıcı bilgileri', required: false })
  receiver?: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({ description: 'Mesaj türü' })
  type: string;

  @ApiProperty({ description: 'Oluşturulma tarihi' })
  createdAt: Date;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  updatedAt: Date;
}