import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChecklistDTO } from './checklist.dto';
import { StickyNoteDTO, StickyNotesGroupDTO } from './sticky-note.dto';
import { KanbanDataDTO } from './kanban.dto';
import { PomodoroDataDTO } from './pomodoro.dto';

export class PlataformToolsDTO {
  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @ValidateNested()
  @IsOptional()
  pomodoroData: PomodoroDataDTO[];

  @ValidateNested()
  @IsOptional()
  kanbanData: KanbanDataDTO[];

  @ValidateNested()
  @IsOptional()
  stickyNotes: StickyNotesGroupDTO[];

  @ValidateNested()
  @IsOptional()
  checklist: ChecklistDTO[];
}
