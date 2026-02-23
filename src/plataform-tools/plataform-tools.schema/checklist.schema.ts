import { Prop, Schema } from '@nestjs/mongoose';
import { ChecklistData } from './utils/checklist-data';
import { stickyNoteColor } from '../utils/types';

@Schema({
  timestamps: true,
})
export class ChecklistSchema {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  color: stickyNoteColor;

  @Prop()
  data: ChecklistData[];
}
