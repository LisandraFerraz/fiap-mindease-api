import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlataformSchema } from './plataform-tools.schema/plataform-tools.schema';
import { PlataformToolsController } from './plataform-tools.controller';
import { PlataformService } from './services/plataform-tools.service';
import { PomodoroService } from './services/pomodoro.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PlataformToolSchema', schema: PlataformSchema },
    ]),
  ],
  providers: [PlataformService, PomodoroService],
  controllers: [PlataformToolsController],
})
export class PlataformToolsDataModule {}
