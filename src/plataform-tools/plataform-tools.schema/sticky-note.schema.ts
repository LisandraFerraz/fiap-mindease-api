import { Prop, Schema } from '@nestjs/mongoose';
import { stickyNoteColor } from '../utils/types';
import { IsString } from 'class-validator';

@Schema({
  timestamps: true,
})
export class StickyNotesGroupSchema {
  @Prop()
  id: string;

  @Prop()
  groupName: string;

  @Prop()
  data: StickyNoteDataSchema[];
}

export class StickyNoteDataSchema {
  @Prop()
  id: string;

  @Prop()
  description: string;

  @Prop()
  title: string;

  @Prop()
  color: stickyNoteColor;
}
