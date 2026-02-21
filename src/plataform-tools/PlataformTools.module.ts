import { PlataformToolsController } from './controllers/plataform-tools.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlataformSchema } from './plataform-tools.schema/plataform-tools.schema';
import { PlataformService } from './services/plataform-tools.service';
import { PomodoroService } from './services/pomodoro.service';
import { KanbanController } from './controllers/kanban.controller';
import { PomodoroController } from './controllers/pomodoro.controller';
import { KanbanService } from './services/kanban.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PlataformToolSchema', schema: PlataformSchema },
    ]),
  ],
  providers: [PlataformService, PomodoroService, KanbanService],
  controllers: [PlataformToolsController, PomodoroController, KanbanController],
})
export class PlataformToolsDataModule {}
