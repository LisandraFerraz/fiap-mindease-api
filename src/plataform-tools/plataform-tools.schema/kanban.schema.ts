import { Prop, Schema } from '@nestjs/mongoose';
import { kanbanStatus } from '../utils/types';

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
  dueDate: string;

  @Prop()
  description: string;
}
