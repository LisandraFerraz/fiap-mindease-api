import { IsNotEmpty, IsString } from 'class-validator';
import { kanbanPriority, kanbanStatus } from '../utils/types';

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
  priority: kanbanPriority;

  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
