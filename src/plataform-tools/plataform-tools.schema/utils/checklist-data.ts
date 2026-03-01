import { Prop } from '@nestjs/mongoose';

export class ChecklistData {
  @Prop()
  id: string;

  @Prop()
  description: string;

  @Prop()
  completed: boolean;

  @Prop()
  lastUpdated: Date;
}
