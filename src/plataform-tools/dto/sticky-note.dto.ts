import { IsNotEmpty, IsString } from 'class-validator';
import { stickyNoteColor } from '../utils/types';

export class StickyNoteDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  @IsString()
  color: stickyNoteColor;
}
