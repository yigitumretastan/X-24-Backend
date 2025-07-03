import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({ description: 'Etkinlik ID' })
  id: string;

  @ApiProperty({ description: 'Etkinlik başlığı' })
  title: string;

  @ApiProperty({ description: 'Etkinlik açıklaması' })
  description?: string;

  @ApiProperty({ description: 'Başlangıç tarihi' })
  startDate: Date;

  @ApiProperty({ description: 'Bitiş tarihi' })
  endDate: Date;

  @ApiProperty({ description: 'Oluşturan kullanıcı bilgileri' })
  createdBy: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({ description: 'Katılımcı bilgileri' })
  participants: Array<{
    id: string;
    name: string;
    email: string;
  }>;

  @ApiProperty({ description: 'Etkinlik türü' })
  type: string;

  @ApiProperty({ description: 'Etkinlik rengi' })
  color: string;

  @ApiProperty({ description: 'Oluşturulma tarihi' })
  createdAt: Date;

  @ApiProperty({ description: 'Güncellenme tarihi' })
  updatedAt: Date;
}