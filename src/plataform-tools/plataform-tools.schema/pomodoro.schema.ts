import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class PomodoroDataSchema {
  @Prop()
  id: string;

  @Prop()
  description: string;

  @Prop()
  completed: boolean;
}
