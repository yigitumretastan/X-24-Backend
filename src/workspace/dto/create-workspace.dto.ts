import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  inviteCode?: string;

  @IsString()
  @IsOptional()  
  ownerId?: string;
}
