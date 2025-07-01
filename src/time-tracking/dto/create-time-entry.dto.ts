import { IsMongoId } from 'class-validator';

export class CreateTimeEntryDto {
  @IsMongoId()
  workspaceId: string;
}
