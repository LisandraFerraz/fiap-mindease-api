import { PlataformToolsController } from './controllers/plataform-tools.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlataformSchema } from './plataform-tools.schema/plataform-tools.schema';
import { PlataformService } from './services/plataform-tools.service';
import { PomodoroService } from './services/pomodoro.service';
import { KanbanController } from './controllers/kanban.controller';
import { PomodoroController } from './controllers/pomodoro.controller';
import { KanbanService } from './services/kanban.service';
import { StickyNoteService } from './services/sticky-note.service';
import { StickyNoteController } from './controllers/sticky-note.controller';
import { ChecklistController } from './controllers/checklist.controller';
import { ChecklistService } from './services/checklist.service';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PlataformToolSchema', schema: PlataformSchema },
    ]),
  ],
  providers: [
    PlataformService,
    PomodoroService,
    KanbanService,
    StickyNoteService,
    ChecklistService,
    NotificationsService,
  ],
  controllers: [
    PlataformToolsController,
    PomodoroController,
    KanbanController,
    StickyNoteController,
    ChecklistController,
    NotificationsController,
  ],
  exports: [PlataformService],
})
export class PlataformToolsDataModule {}
