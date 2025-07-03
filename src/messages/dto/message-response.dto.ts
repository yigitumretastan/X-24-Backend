import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class ReadStatusDto {
  @ApiProperty()
  userId: string;

  @ApiProperty({ required: false })
  isRead: boolean;

  @ApiProperty({ required: false, type: String, format: 'date-time', nullable: true })
  readAt?: Date | null;
}

export class MessageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: UserDto, nullable: true })
  sender: UserDto | null;

  @ApiProperty({ type: [UserDto] })
  receivers: UserDto[];

  @ApiProperty()
  workspaceId: string;

  @ApiProperty({ required: false })
  channel?: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty({ type: [ReadStatusDto], required: false })
  readStatus?: ReadStatusDto[];

  @ApiProperty({ required: false, type: Object })
  metadata?: Record<string, any>;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;
}
