import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { stickyNoteColor } from '../utils/types';

export class StickyNotesGroupDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  groupName: string;

  @ValidateNested()
  @IsNotEmpty()
  data: StickyNoteDTO[];
}

export class StickyNoteDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  color: stickyNoteColor;
}
