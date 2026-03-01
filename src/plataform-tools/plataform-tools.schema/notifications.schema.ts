import { Prop, Schema } from '@nestjs/mongoose';
import { alertType } from '../utils/types';

@Schema({
  timestamps: true,
})
export class NotificationsSchema {
  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  read: boolean;

  @Prop()
  route: string;

  @Prop()
  description: string;

  @Prop()
  alertType: alertType;
}
