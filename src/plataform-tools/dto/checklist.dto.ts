import {
  IsBoolean,
  isBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChecklistData } from '../plataform-tools.schema/utils/checklist-data';
import { stickyNoteColor } from '../utils/types';

export class ChecklistDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: stickyNoteColor;

  @ValidateNested()
  @IsNotEmpty()
  data: ChecklistDataDTO[];
}

export class ChecklistDataDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;

  @IsNotEmpty()
  lastUpdated: Date;
}
