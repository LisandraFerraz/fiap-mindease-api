import { IsNotEmpty, IsString } from 'class-validator';
import { kanbanStatus } from '../utils/types';

export class KanbanDataDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  status: kanbanStatus;

  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
