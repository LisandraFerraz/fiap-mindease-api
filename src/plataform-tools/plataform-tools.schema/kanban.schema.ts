import { Prop, Schema } from '@nestjs/mongoose';
import { kanbanPriority, kanbanStatus } from '../utils/types';

@Schema({
  timestamps: true,
})
export class KanbanDataSchema {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  status: kanbanStatus;

  @Prop()
  priority: kanbanPriority;

  @Prop()
  dueDate: string;

  @Prop()
  description: string;

  @Prop()
  dayCountMessage: string;
}
