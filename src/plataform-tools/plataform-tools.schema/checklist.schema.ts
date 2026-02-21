import { Prop, Schema } from '@nestjs/mongoose';
import { ChecklistData } from './utils/checklist-data';

@Schema({
  timestamps: true,
})
export class ChecklistSchema {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  data: ChecklistData[];
}
