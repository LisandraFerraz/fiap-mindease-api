import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PomodoroService } from '../services/pomodoro.service';
import { PomodoroDataDTO } from '../dto/pomodoro.dto';

@Controller('pomodoro')
export class PomodoroController {
  constructor(private pomodoroService: PomodoroService) {}

  @Get(':id')
  async getAllPomodoroTodos(@Param('id') id: string) {
    return await this.pomodoroService.getAllPomodoroTodos(id);
  }

  @Post(':id/novo-pomodoro-todo')
  async addPomodoroTodo(
    @Body() body: PomodoroDataDTO,
    @Param('id') id: string,
  ) {
    return await this.pomodoroService.addPomodoroTodo(id, body);
  }

  @Patch(':id/atualiza-pomodoro-todo')
  async updatePomodoroTodo(
    @Body() body: PomodoroDataDTO,
    @Param('id') id: string,
  ) {
    return await this.pomodoroService.updatePomodoroTodo(id, body);
  }

  @Delete(':id/deleta-pomodoro-todo/:todoId')
  async deletePomodorTodo(
    @Param('id') id: string,
    @Param('todoId') todoId: string,
  ) {
    return await this.pomodoroService.deletePomodorTodo(id, todoId);
  }
}
