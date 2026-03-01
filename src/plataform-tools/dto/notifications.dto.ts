import { IsNotEmpty, IsString } from 'class-validator';
import { alertType } from '../utils/types';

export class NotificationsDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  read: boolean;

  @IsString()
  @IsNotEmpty()
  route: string;

  @IsString()
  @IsNotEmpty()
  alertType: alertType;
}
