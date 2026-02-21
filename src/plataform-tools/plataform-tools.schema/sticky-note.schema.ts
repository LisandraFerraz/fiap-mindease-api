import { Prop, Schema } from '@nestjs/mongoose';
import { stickyNoteColor } from '../utils/types';

@Schema({
  timestamps: true,
})
export class StickyNoteDataSchema {
  @Prop()
  id: string;

  @Prop()
  description: string;

  @Prop()
  createdAt: string;

  @Prop()
  color: stickyNoteColor;
}
