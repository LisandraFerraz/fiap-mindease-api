import {
  IsBoolean,
  isBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChecklistData } from '../plataform-tools.schema/utils/checklist-data';

export class ChecklistDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @IsNotEmpty()
  data: ChecklistDataDTO[];
}

class ChecklistDataDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;
}
