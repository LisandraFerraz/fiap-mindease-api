import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PomodoroDataSchema } from './pomodoro.schema';
import { KanbanDataSchema } from './kanban.schema';
import { StickyNoteDataSchema } from './sticky-note.schema';
import { ChecklistSchema } from './checklist.schema';

@Schema({
  timestamps: true,
})
export class PlataformToolSchema {
  @Prop()
  usuarioId: string;

  @Prop()
  pomodoroData: PomodoroDataSchema[];

  @Prop()
  kanbanData: KanbanDataSchema[];

  @Prop()
  stickyNotes: StickyNoteDataSchema[];

  @Prop()
  checklist: ChecklistSchema[];
}


export type PlataformDocument = PlataformToolSchema & Document;
export const PlataformSchema = SchemaFactory.createForClass(PlataformToolSchema);
