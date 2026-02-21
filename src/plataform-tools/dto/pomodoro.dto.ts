import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PomodoroDataDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;
}
